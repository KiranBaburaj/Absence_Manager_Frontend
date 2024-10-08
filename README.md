

# Absence Manager -Leave Application and Approval System

## Project Description

The Leave Application and Approval System is a web-based application designed to facilitate the seamless submission, review, and approval of leave requests within an organization. This system enables employees to submit leave applications while allowing managers to review and manage those requests effectively.

## Table of Contents

- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [Usage](#usage)
- [Deliverables](#deliverables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **User Authentication**: Secure login system for authorized users (employees and managers).
- **Leave Application Submission**: Employees can submit leave requests specifying the type of leave, duration, and reason.
- **Leave Status Management**: Managers can review, approve, or reject leave requests submitted by their team members.
- **Calendar View**: Visual representation of leave schedules to identify potential conflicts or overlapping leave periods.
- **Total Leaves Report**: Displays total leaves applied by each employee, indicating various leave types and their status.
- **Responsive Design**: Accessible across different devices and browsers.

## Technologies Used

- **Frontend**: [React](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/)
- **Backend**: [Django](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT or Session-based authentication
- **Payment Gateway (if applicable)**: [Razorpay](https://razorpay.com/)

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone [https://github.com/KiranBaburaj/Absence_Manager_Frontend.git]
   ```

2. Navigate to the project directory:
   ```bash
   cd Absence_Manager_Frontend
   ```

3. Install the required packages:
   ```bash
   npm install
   ```

4. Set up the backend (if applicable) by following similar steps in the backend repository.

5. Run the development server:
   ```bash
   npm start
   ```

6. Access the application in your web browser at `http://localhost:3000`.

## Usage

- **For Employees**: Log in to submit leave requests, view leave statuses, and track your total leaves.
- **For Managers**: Log in to review and manage leave requests from your team.

## Deliverables

- Fully functional web application with intuitive interfaces for leave application submission, approval, and management.
- Comprehensive documentation covering system requirements, installation instructions, user guides, and troubleshooting tips.
- Test cases and test results demonstrating the functionality and reliability of the system.

## Testing

- Ensure all functionalities are tested as per the test cases documented in the `/tests` directory.
- Use the following command to run tests (if applicable):
  ```bash
  npm test
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.


