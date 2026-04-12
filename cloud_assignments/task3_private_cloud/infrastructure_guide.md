# Private Cloud Infrastructure Setup Guide

This guide explains how to set up your own cloud application (OwnCloud) and your private cloud infrastructure (OpenStack).

## 1. Cloud-Based Application: ownCloud
ownCloud provides a private file-sharing and collaboration platform.

### Deployment (Using Docker)
1. Ensure **Docker** and **Docker Compose** are installed on your machine.
2. Navigate to `cloud_assignments/task3_private_cloud/owncloud/`.
3. Run the following command:
   ```bash
   docker-compose up -d
   ```
4. Access the application at `http://localhost:8080`.
5. Login with:
   - **Username**: `admin`
   - **Password**: `admin`

## 2. Private Cloud Infrastructure: OpenStack
OpenStack is the industry standard for creating private cloud infrastructure.

### Physical/Virtual Infrastructure Requirements
- **Host OS**: Ubuntu 22.04 LTS (Clean installation recommended).
- **RAM**: Minimum 8GB (16GB+ recommended).
- **CPU**: 4 Cores with Virtualization (VT-x) enabled.
- **Network**: Internet access for dependency installation.

### Installation via DevStack (Single Node)
1. **Create a Stack user**:
   ```bash
   sudo useradd -s /bin/bash -d /opt/stack -m stack
   sudo chmod +x /opt/stack
   echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack
   sudo -u stack -i
   ```
2. **Clone DevStack**:
   ```bash
   git clone https://opendev.org/openstack/devstack
   cd devstack
   ```
3. **Copy Configuration**:
   Move the provided `local.conf` from this project to the `devstack` directory.
   ```bash
   cp /path/to/local.conf .
   ```
4. **Run the Installation**:
   ```bash
   ./stack.sh
   ```
5. **Post-Installation**:
   Once complete, access the OpenStack Dashboard (Horizon) via the IP address of your host.
   - **Login**: `admin`
   - **Password**: `password` (as defined in `local.conf`)

### Verification
- Run `openstack service list` to verify all cloud services (Nova, Keystone, Neutron, etc.) are active.
- Create a virtual machine instance via the Horizon dashboard to verify the infrastructure is working.
