import numpy as np
import matplotlib.pyplot as plt

data = [
    (1, 4, 8, 3, 6, 5, 10),
    (2, 5, 9, 4, 7, 6, 12),
    (4, 6, 11, 6, 8, 7, 13),
]

fig, ax = plt.subplots()
x = []
y = []
yerr = []
for m in data:
    x.append(m[0])  # amount of functions
    y.append(m[1])  # aws avg
    yerr.append((m[1] - m[3], m[5] - m[1]))
yerr = np.asarray(yerr).transpose()
ax.errorbar(x, y, yerr=yerr)
plt.show()
