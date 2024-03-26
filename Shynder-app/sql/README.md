# SQL module for Shynder
The purpose of this module is to provide a way to interact with a SQL database in a simple way. This module is designed to be used with Shynder app and it is not intended to be used as a standalone module.

## Module file structure
- 'database.py': This file initializes the database connection and provides a way to interact with the database.
- 'models.py': This file contains the sqlalchemy models for the database tables.
    Classes:
    - 'User': This class represents the 'users' table.
    - 'Match': This class represents the 'matches' table.
    - 'Likes': This class represents the 'likes' table.
- 'schemas.py': This file contains the pydantic schemas for the database tables.
- 'db_wrapper.py': This file contains the CRUD utilities for the database tables.


