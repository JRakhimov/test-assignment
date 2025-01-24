
### **Features**

1. **User Management**: Create users with unique usernames.
2. **Group Management**: Create groups with titles.
3. **Item Management**: Create items with titles.
4. **Association**:
  * Add users to groups.
  * Add items to groups.
5. **Query**:
  * Retrieve a list of unique items associated with a user.

### **Endpoints**

**User Endpoints**
  * **POST /users**
  * **Description**: Create a new user.
  * **Body**: `{ "username": "string" }`
  * **Response**: `{ "id": 1, "username": "testUser", "createdAt": "2025-01-24T12:00:00Z", "updatedAt": "2025-01-24T12:00:00Z" }`

**Group Endpoints**
  * **POST /groups**
  * **Description**: Create a new group.
  * **Body**: `{ "title": "string" }`
  * **Response**: `{ "id": 1, "title": "testGroup", "createdAt": "2025-01-24T12:00:00Z", "updatedAt": "2025-01-24T12:00:00Z" }`

**Item Endpoints**
  * **POST /items**
  * **Description**: Create a new item.
  * **Body**: `{ "title": "string" }`
  * **Response**: `{ "id": 1, "title": "testItem", "createdAt": "2025-01-24T12:00:00Z", "updatedAt": "2025-01-24T12:00:00Z" }`

**Association Endpoints**
  * **POST /groups/:groupId/items/:itemId**
  * **Description**: Add an item to a group.
  * **Response**: HTTP 200

  * **POST /groups/:groupId/users/:userId**
  * **Description**: Add a user to a group.
  * **Response**: HTTP 200

**Query Endpoints**
  * **GET /items?username=:username**
  * **Description**: Retrieve a list of unique items associated with a user.
  * **Response**: `["A1", "A2", "B1", "A3"]`

### **Repository description**

The project is written in TypeScript using the NestJS framework with a PostgreSQL database.

The Prisma ORM is used to work with the database, and for integration and end-to-end tests, the database is mocked using a simplified version of PostgreSQL: PGLite.

The project is built based on the DDD (Domain-Driven Design) architecture and follows Airbnb's code style guidelines.

**Testing**
  * Unit tests: Jest
  * Integration tests: Jest + PGLite
  * E2E tests: Jest + Supertest + PGLite
  * Stress tests: Artillery

### **Setup**
**Steps to run the project**
1. Clone the Repository:
```
git clone https://github.com/JRakhimov/test-assignment.git
cd test-assignment
```
2. Install dependencies:
`npm install`
3. Create .env file with env variables:
`DATABASE_URL=postgresql://user:password@localhost:5432/database_name`
4. Apply migrations:
`npm run prisma:migrate`
5. Run in dev mode:
`npm run start:dev`
6. API is available at the `http://localhost:3000`

**Steps to run tests**
1. Unit tests + Integration tests: `npm run test`
2. E2E tests: `npm run test:e2e`
3. Stress tests: `npm run test:stress`
