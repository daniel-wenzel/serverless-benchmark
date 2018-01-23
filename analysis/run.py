import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('../logs/spike_1.csv')

# plot overview over whole time
df.boxplot(column="StartupLatency_clockDrifted", by=["system", "new_container"])
plt.show()

#df["exp_5"] = df["1_requeestSentExperimentTime"] // 1000 * 1000
#print(df)

#df.boxplot(column="StartupLatency_clockDrifted", by=["exp_5", "system"])
#plt.show()
