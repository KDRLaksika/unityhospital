# Unity Hospital AWS Deployment Guide

This guide will walk you through deploying your Dockerized Spring Boot and React application to an AWS EC2 instance.

## Prerequisites

1.  **AWS Account:** You need an active AWS account.
2.  **GitHub Repository:** Your code should be pushed to GitHub.
3.  **Amazon ECR:** You need to create an Elastic Container Registry (ECR) repository for each microservice and the frontend.

## Step 1: Set up Amazon ECR & GitHub Actions (CI/CD)

The `.github/workflows/deploy.yml` file is configured to automatically build your Docker images and push them to Amazon ECR whenever you push code to GitHub.

1.  Go to the AWS Console -> **Elastic Container Registry (ECR)**.
2.  Create private repositories for each service (e.g., `unityhospital-apigateway`, `unityhospital-authservice`, `unityhospital-frontend`, etc.).
3.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
4.  Add the following secrets:
    *   `AWS_ACCESS_KEY_ID`: Your AWS IAM user access key.
    *   `AWS_SECRET_ACCESS_KEY`: Your AWS IAM user secret key.
    *   `AWS_REGION`: The region where you created your ECR repositories (e.g., `us-east-1`).
    *   `AWS_ECR_REGISTRY`: The URI of your ECR registry (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com`).

Once these are set, pushing to GitHub will build and store your images in ECR.

## Step 2: Create an EC2 Instance

1.  Go to the AWS Console -> **EC2** -> **Launch Instance**.
2.  **Name:** `unityhospital-server`
3.  **AMI:** Select **Ubuntu Server 24.04 LTS**.
4.  **Instance Type:** Since you have 11 Java microservices, you need at least **t3.large** or **t3.xlarge** (8GB or 16GB RAM) to run them all comfortably, plus Postgres and MongoDB.
5.  **Key Pair:** Create a new key pair (e.g., `unityhospital-key.pem`) and download it securely.
6.  **Network Settings:** Check the following boxes:
    *   Allow SSH traffic from Anywhere (Port 22)
    *   Allow HTTP traffic from the internet (Port 80 - for your React frontend)
    *   Allow Custom TCP for Port `8080`, `3000`, `5432` if you want to test them publicly, though running them behind a reverse proxy is better.

## Step 3: Install Docker on EC2

Connect to your EC2 instance via SSH:
```bash
ssh -i "unityhospital-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Install Docker and Docker Compose:
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Give ubuntu user permissions
sudo usermod -aG docker ubuntu
```
*Note: Log out of SSH and log back in for the permission change to take effect.*

## Step 4: Run the Application

1. Pull your `docker-compose.yml`, `init-databases.sql`, and `init-users.sql` onto the server. You can clone your repository or SCP them.
2. Ensure your `.env` file is present on the server with `DB_PASSWORD`.
3. Modify the `docker-compose.yml` to point the `image` lines to your Amazon ECR URIs instead of the local `build: ./backend/...` directives.
4. Run:
```bash
docker compose up -d
```

Your system will boot up on AWS!
