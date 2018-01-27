import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook
import os
import re

TEST_FOLDER_REGEX = re.compile(r'^test-\d+$')


def get_test_no(max_no):
    test_no = None
    while test_no is None:
        _test_no = input("Input test number [0-%s]" % str(max_no))
        try:
            test_no = int(_test_no)
            if 0 > test_no or test_no > max_no:
                raise Exception()
        except:
            print("Invalid value entered.")
            test_no = None
    return test_no


if __name__ == '__main__':
    base_folder = os.path.join(os.path.dirname(__file__), '..')
    base_folder_contents = os.listdir(base_folder)
    tests = list(
        filter(lambda folder: TEST_FOLDER_REGEX.match(folder) and os.path.isdir(os.path.join(base_folder, folder)),
               base_folder_contents))
    if len(tests) == 0:
        print("You have not done any tests. Exiting.")
        exit()
    print("You have done the following test%s" % 's. Please choose one:' if len(tests) > 1 else '')
    for i in range(len(tests)):
        print("[%s]: %s" % (i, tests[i]))
    # if len(tests) > 1:
    #     test_no = get_test_no(len(tests) - 1)
    # else:
    #     test_no = 0
    test_no = 0
    results_csv = os.path.join(base_folder, tests[test_no], 'results.csv')
    f__results_csv = open(results_csv, 'r')

    data = []

    line = f__results_csv.readline()  # header
    line = f__results_csv.readline()
    while line is not None and len(line) > 0:
        items = line.split(',')
        data.append([int(items[0]), list(map(float, items[1].split('~'))), list(map(float, items[2].split('~')))])
        line = f__results_csv.readline()
    f__results_csv.close()

    fig, ax = plt.subplots()
    x = []
    y = []
    all_y = []
    yerr = []
    for m in data:
        x.append(m[0])  # amount of functions
        aws_times = m[1]
        mean = np.asarray(aws_times).mean()
        y.append(mean)  # aws avg
        yerr.append((mean - min(aws_times), max(aws_times) - mean))
        all_y.append(aws_times)
    stats = cbook.boxplot_stats(np.asarray(all_y).transpose(), labels=x, bootstrap=10000)
    boxprops = dict(linestyle='-', linewidth=1, color='darkgoldenrod')
    ax.bxp(stats, showfliers=False, boxprops=boxprops)
    # yerr = np.asarray(yerr).transpose()
    # ax.errorbar(x, y, yerr=yerr, label="Serverless with AWS", linestyle='None', marker='o', markersize=5)

    x = []
    y = []
    all_y = []
    yerr = []
    for m in data:
        x.append(m[0])  # amount of functions
        gcp_times = m[2]
        mean = np.asarray(gcp_times).mean()
        y.append(mean)  # aws avg
        yerr.append((mean - min(gcp_times), max(gcp_times) - mean))
        all_y.append(gcp_times)
    stats = cbook.boxplot_stats(np.asarray(all_y).transpose(), labels=x, bootstrap=10000)
    boxprops = dict(linestyle='-', linewidth=1, color='blue')
    ax.bxp(stats, showfliers=False, boxprops=boxprops)
    # yerr = np.asarray(yerr).transpose()
    # ax.errorbar(x, y, yerr=yerr, label="Serverless with GCP", linestyle='None', marker='o', markersize=5)
    ax.legend(loc='upper left')
    ax.set_xlabel('Amount of functions')
    ax.set_ylabel('Deployment time (serverless deploy) in seconds')

    plt.figtext(0.15, 0.75, 'Serverless with AWS',
                backgroundcolor='darkgoldenrod', color='black', weight='roman',
                size='small')
    plt.figtext(0.15, 0.8, 'Serverless with GCP',
                backgroundcolor='blue',
                color='white', weight='roman', size='small')
    plt.title("Deployment latency results")
    plt.show()
