import os

# Change directory to "Shynder-app"
os.chdir('./Shynder-app')

# Run the app
os.system('uvicorn main:app --port 8000')