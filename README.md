# Linx REST Service as Static Website Backend

## Description

This sample shows how a Linx REST Service can be used as the backend to a static website. 
It allows for user registrations, logins and user info updates. 
The website uses Javascript to communicate with the REST service and does not require any server-side scripting. 

## Installation

### Pre-requisites
- MySQL Database Server

### Database

1. Run SQL scripts
2. Setup ODBC

### Linx

1. Open Solution
2. Open Settings

	a. Add a connection string to the database in the ConnectionString setting
    
    b. Add a random string in the BearerSecret setting

    c. Change the CORSOrigin setting to point to your website server URL (e.g. http://localhost)

### Website

1. Copy website files to a folder of your choice
2. Right-click on the index.html file and open in a browser of your choice

OR

2. Browse to the website using a local webserver

## Usage

Description: The example website includes user registration, login and updating user info

Usage:

1. Debug WebSiteBackendRESTHost Service in the Linx Designer
2. Open index.html in browser
3. Register a user
4. Login to site
5. Change user info
