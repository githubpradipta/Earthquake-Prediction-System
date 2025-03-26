import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Load dataset
data = pd.read_csv("./earthquake.csv")

# Convert to NumPy array for slicing (if necessary)
data = np.array(data)
X = data[:, 0:-1].astype('int')
y = data[:, -1].astype('int')

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Train RandomForestClassifier
rfc = RandomForestClassifier()
rfc.fit(X_train, y_train)

y_pred = rfc.predict(X_test)

# Save model
pickle.dump(rfc, open('model.pkl', 'wb'))
print("Model saved")

# Visualization
# plt.figure(figsize=(6, 4))
# sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=np.unique(y), yticklabels=np.unique(y))
# plt.xlabel("Predicted Label")
# plt.ylabel("True Label")
# plt.title("Confusion Matrix")
# plt.show()

# # Feature Importance
# plt.figure(figsize=(8, 5))
# importances = rfc.feature_importances_
# plt.bar(range(X.shape[1]), importances, color='skyblue')
# plt.xlabel("Feature Index")
# plt.ylabel("Feature Importance")
# plt.title("Feature Importance in RandomForest")
# plt.show()