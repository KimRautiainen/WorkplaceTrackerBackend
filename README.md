# Workplace Tracker Backend

Welcome to the Workplace Tracker Backend repository! This system is designed to manage worker details, company affiliations, department roles, and work areas efficiently. With robust support for complex relationships and secure authentication, it facilitates detailed tracking of workplace dynamics.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) 
- [MySQL](https://www.mysql.com/downloads/) or [MariaDB](https://mariadb.org/download/)

### Installation

1. **Clone the Repository**

git clone https://github.com/KimRautiainen/WorkplaceTrackerBackend.git
cd WorkplaceTrackerBackend

markdown
Copy code

2. **Install Dependencies**

Run the following command to install the required node modules:

```bash
npm install
```
3. **Set Up Environment Variables**

The project uses environment variables for configuration. Since the `.env` file is not included in the repository (ignored via `.gitignore` for security reasons), you'll need to create it manually in the project's root directory.


4. **Initialize the Database**

Execute the SQL script included in the repository to set up your database schema:
```bash
mysql -u yourUsername -p yourDatabaseName < path/to/sql_script.sql
```

Replace `yourUsername`, `yourDatabaseName`, and `path/to/sql_script.sql` with your MySQL/MariaDB username, the name of your database, and the path to the provided SQL script, respectively.

### Running the Application

To start the application, run:
```bash
npm start
```
You should see a message indicating that the app is running and listening on a specified port (default: 3000).

## Documentation

- **API Documentation**: [Guest link to postman team workspace](https://workplacetracker.postman.co/workspace/Team-Workspace~1b5dd4ce-5490-45ff-8fb0-19de316cb1bd/collection/31432766-c1f929d1-93ba-4a5e-8a65-c6ddd9e00031?action=share&creator=31432766)


- **SQL Schema**: The SQL documentation is available on the [Wiki page](https://github.com/KimRautiainen/workplaceTrackerBackend/wiki/SQL) of this repository.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
