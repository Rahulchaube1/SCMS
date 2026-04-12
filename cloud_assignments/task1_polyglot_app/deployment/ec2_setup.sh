#!/bin/bash
# Amazon EC2 Deployment Script for Polyglot App (Ubuntu 22.04)

# 1. Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install Java 17
sudo apt-get install openjdk-17-jdk -y

# 3. Install Python 3.11 and pip
sudo apt-get install python3.11 python3-pip -y

# 4. Install Docker (Alternative for cleaner deployment)
sudo apt-get install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# 5. Clone Application (User would replace this with their repo)
# git clone <your-repo-url> /home/ubuntu/app
# cd /home/ubuntu/app

echo "Deployment environment ready!"
echo "To run Java Service: ./mvnw spring-boot:run"
echo "To run Python Service: pip install -r requirements.txt && uvicorn main:app"
