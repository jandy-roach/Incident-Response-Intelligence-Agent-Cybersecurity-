#!/usr/bin/env python
import sys
import os
import uvicorn

# Add the script directory to the path
sys.path.insert(0, os.path.dirname(__file__))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
