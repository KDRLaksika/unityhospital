# Unity Hospital - AWS Deployment Guide

Welcome! This guide will hold your hand through the process of taking your project from your local computer and putting it onto a real server in the cloud (AWS EC2).

## Step 1: Create an AWS EC2 Instance (Your Cloud Computer)

1. **Log in to AWS:** Go to the AWS Management Console.
2. **Go to EC2:** Search for "EC2" in the top bar.
3. **Launch Instance:** Click the orange **"Launch instance"** button.
4. **Name it:** Call it "UnityHospital-Server".
5. **Choose an OS:** Select **Ubuntu** (Ubuntu Server 24.04 LTS is a great choice).
6. **Instance Type:** Since you have 11 Java Spring Boot microservices, a `t2.micro` (the free tier) will **NOT** be enough RAM. You will need at least a `t3.medium` or `t3.large` (4GB to 8GB of RAM).
7. **Key Pair:** Click "Create new key pair". Name it "unity-key", choose **RSA**, and **.pem**. Click "Create". This file will download to your computer—**keep it safe!**
8. **Network Settings:** Check the boxes for:
   - Allow SSH traffic from (Anywhere)
   - Allow HTTP traffic from the internet
   - Allow HTTPS traffic from the internet
9. **Launch:** Click **"Launch instance"** at the bottom right.

## Step 2: Connect to Your New Server

1. Once your instance handles say "Running", click on its **Instance ID**.
2. Click the **"Connect"** button at the top.
3. The easiest way is to use **"EC2 Instance Connect"**. Just click the orange **Connect** button at the bottom of that page, and a black terminal window will open in your browser.

## Step 3: Install Docker and Docker Compose

Now that you are "inside" your cloud computer, you need to install Docker (the engine that runs your containers). Run these commands one by one:

```bash
# Update the package list
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose-v2

# Start Docker and enable it to start on boot
sudo systemctl start docker
sudo systemctl enable docker

# Give your user permission to run Docker without typing "sudo" every time
sudo usermod -aG docker ubuntu
```
*Note: You may need to close the terminal and reconnect for the last permission command to take effect.*

## Step 4: Get Your Code on the Server

You need to clone your repository (which now has the `docker-compose.yml`) onto the server.

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/unityhospital.git

# Move into the folder
cd unityhospital
```

## Step 5: Start the Project!

This is the magic moment. Because we set up standard `Dockerfile`s and a `docker-compose.yml`, you only need one command to start Postgres, MongoDB, your 11 microservices, and your frontend!

```bash
# Start all services in the background "-d"
docker compose up -d --build
```

Docker will now read the instructions, build the images, and start everything beautifully.
Wait a few minutes (Java takes a moment to boot up).

### How to Access It:
Go back to your AWS Console, find your EC2 instance, and copy the **Public IPv4 address**.
Paste that into your browser: `http://YOUR_PUBLIC_IP:3000` (since we exposed the frontend on port 3000).

---

## Helpful Commands for the Future

- To see if everything is running securely: `docker compose ps`
- To stop the server gracefully: `docker compose down`
- To view logs if something crashes: `docker compose logs -f` (or `docker logs [container_name]`)
