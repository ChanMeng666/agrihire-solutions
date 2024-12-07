<div align="center">
 <h1>AgriHire Solutions: Equipment and Order Management System</h1>
 <img src="https://img.shields.io/badge/Status-Active-brightgreen"/>
 <img src="https://img.shields.io/badge/License-MIT-blue"/>
 <img src="https://img.shields.io/badge/Version-1.0.0-orange"/>
 <img src="https://img.shields.io/badge/Python-3.8+-green"/>
 <img src="https://img.shields.io/badge/Flask-3.0.2-red"/>
</div>

A comprehensive web application for managing agricultural equipment rentals, inventory, bookings and customer relationships. Built with Python Flask and MySQL.

![screenshot](path_to_screenshot.png)

## Features

### Customer Portal
- Equipment browsing and searching with detailed product information 
- Shopping cart functionality with real-time availability checking
- Online booking and payment processing
- Account management and booking history
- Promotional code support
- Store locator with distance calculation
- Customer messaging system

### Staff Portal
- Equipment check-in/check-out management
- Real-time inventory tracking
- Equipment maintenance records
- Customer booking management
- Store-specific reporting

### Management Portal
- Multi-store inventory management
- Staff and customer management
- Promotional campaign management 
- Financial reporting
- Equipment utilization analytics
- Store performance monitoring

### System Features
- Role-based access control (Customer, Staff, Local Manager, National Manager, Admin)
- Real-time availability checking
- Automated notifications
- Equipment maintenance tracking
- Multi-store support
- Responsive design

## Technology Stack

- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Authentication**: Flask-WTF with BCrypt
- **Form Handling**: WTForms
- **Address Validation**: Addy API
- **Visualization**: ECharts
- **Additional Libraries**: 
  - geopy (distance calculations)
  - mysql-connector-python
  - requests
  - email_validator

## Getting Started

### Prerequisites
- Python 3.x
- MySQL
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/ChanMeng666/agrihire-solutions.git
```

2. Create and configure database connection
Create `connect.py` under `eoms` folder with your database configuration:
```python
dbuser = "your_username"
dbpass = "your_password" 
dbhost = "localhost"
dbport = "3306"
dbname = "agrihire"
```

3. (Optional) Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

4. Install dependencies
```bash
pip install -r requirements.txt
```

5. Create database
- Run `database/agrihire_db+data.sql` to create database schema and sample data
- Disable Safe Updates mode in MySQL Workbench if needed

6. Start the application
```bash
python run.py
```

## Test Accounts

All accounts use the same password: `Test1234!`

### Customer Accounts
| Email           | Role     |
| --------------- | -------- |
| cust1@email.com | customer |
| cust2@email.com | customer |

### Staff Accounts
| Email                 | Role          |
| --------------------- | ------------- |
| staff1@agrihire.nz    | staff         |
| lmanager1@agrihire.nz | local manager |
| admin@agrihire.nz     | admin         |

## Development

### Project Structure
```
agrihire/
├── eoms/
│   ├── model/         # Database models 
│   ├── route/         # Route handlers
│   ├── form/          # Form definitions 
│   ├── static/        # Static assets
│   └── templates/     # HTML templates
├── database/          # SQL scripts
└── requirements.txt   # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: https://agrihireaq.pythonanywhere.com/
