# Description
  ERPMax is a web app based on React and Flask, which is an inventory management application that enables the user to manage the inventory of a list of products in the respective warehouses. 

# Functionality
 - Get/ Create/ Edit products, locations, and products movements.
 - View product balance report for each location.
 - Request and data validation.
 
# Used Technologies
 - **Frontend:** ReactJs, Material Design for Bootstrap, HTML, CSS.
 - **Backend:** Python (Flask).
 - **DB:** MySQL.

# How to run project
 - Open your terminal.
 - Clone the project repo via `git clone https://github.com/ameentalahmeh/erpmax-test.git` command, then `cd erpmax-test`.
 - Create your MySQL database.
    - Note: You can use the pushed `products_store_db.sql` file to prepare your database tables.
 - Configure your database to connect with the Flask API through editing `yaml.db` file, and update enviroment variables with your database details.
 - Running the project:
    1. Go to `client` folder using `cd client` command.
    2. Install all used node modules via `npm install` command.
    3. Run the project using `npm run dev`.
  - Website is running, Enjoy :) 

# Screenshots
 ## Home view
  - Home page
  
  ![Home page](https://i.ibb.co/qBDPXhh/Whats-App-Image-2021-01-19-at-1-11-11-AM.jpg)
  
 ## Product view
  - Products page
  
  ![Products page](https://i.imgur.com/y3IRIN6.png)
  
  - Create product
  
  ![ِCreate product](https://i.imgur.com/HHD4hg1.png)
  
  - Edit product
  
  ![ِEdit product](https://i.imgur.com/bbqMxE1.png)
  
  
  - Add movement
  
  ![ِCreate movement](https://i.imgur.com/bIUB5Ng.png)
  
  - Edit movement
  
  ![ِEdit movement](https://i.imgur.com/aCNaXym.png)
 
 ## Location view
  - Locations page
  
  ![Locations page](https://i.imgur.com/UabvRYy.png)
  
  - Create location
  
  ![ِCreate product](https://i.imgur.com/HHD4hg1.png)
  
  - Edit location
  
  ![ِEdit product](https://i.imgur.com/Yvu2aGR.png)
  
 ## Report view
  - Report page
  
  ![Report page](https://i.imgur.com/urWvngT.png)
  
 ## Validation
  - No enough products at location
  
  ![No enough products](https://i.imgur.com/1iHo9Ps.png)
  
  - No changes made
  
  ![No changes made](https://i.imgur.com/IHsBrjY.png)
  
  - Required inputs are empty
  
  ![Required Inputs are empty](https://i.imgur.com/0ggKWfI.png)

  - Inputs with invalid formats
  
  ![Inputs with invalid format](https://i.imgur.com/SqhobLT.png)
  
  
