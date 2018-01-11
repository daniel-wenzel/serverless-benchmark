import numpy as np
import matplotlib.pyplot as plt
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
    if len(tests) > 1:
        test_no = get_test_no(len(tests) - 1)
    else:
        test_no = 0
    results_csv = os.path.join(base_folder, tests[test_no], 'results.csv')
    f__results_csv = open(results_csv, 'r')

    data = []

    line = f__results_csv.readline()  # header
    line = f__results_csv.readline()
    while line is not None and len(line) > 0:
        data.append(list(map(float, line.split(','))))
        line = f__results_csv.readline()

    fig, ax = plt.subplots()
    x = []
    y = []
    yerr = []
    for m in data:
        x.append(m[0])  # amount of functions
        y.append(m[1])  # aws avg
        yerr.append((m[1] - m[3], m[5] - m[1]))
    yerr = np.asarray(yerr).transpose()
    ax.errorbar(x, y, yerr=yerr, label="Serverless with AWS")

    x = []
    y = []
    yerr = []
    for m in data:
        x.append(m[0])  # amount of functions
        y.append(m[2])  # aws avg
        yerr.append((m[2] - m[4], m[6] - m[2]))
    yerr = np.asarray(yerr).transpose()
    ax.errorbar(x, y, yerr=yerr, label="Serverless with GCP")
    ax.legend(loc='lower right')
    ax.set_xlabel('Amount of functions')
    ax.set_ylabel('Deployment time (serverless deploy) in seconds')
    plt.show()
