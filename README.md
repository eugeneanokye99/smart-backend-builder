# Smart Backend Builder

An AI-powered workflow that automates Node.js backend entity generation using a multi-stage approach with ChatGPT, GitHub Copilot, and Postman AI.

## Overview

This project demonstrates how to chain three different AI tools to generate complete backend implementations—from database schemas to tested REST APIs—reducing manual development time by 65-70%.

## Problem

Creating backend entities manually involves:
- Designing database schemas with validations
- Writing Mongoose models with proper types and constraints
- Implementing controller functions for CRUD operations
- Defining REST API routes
- Creating comprehensive test suites

**Time Required:** 30-45 minutes per entity

## Solution

A three-stage AI workflow that automates the entire process:

1. **ChatGPT** generates intelligent JSON schemas based on entity names
2. **GitHub Copilot** creates models, controllers, routes, and API documentation
3. **Postman AI** generates comprehensive test collections with assertions

**Time Required:** 10-15 minutes per entity

## Workflow

```
Entity Name → ChatGPT → Schema JSON → Copilot → Backend Code + Docs → Postman AI → Tests
```

## Prerequisites

- Node.js (v14+)
- VS Code with GitHub Copilot extension
- Postman desktop app
- ChatGPT account
- npm packages: `express`, `mongoose`, `bcrypt`

## Project Structure

```
project/
├── schemas/              # JSON schema definitions
│   └── [entity]_schema.json
├── models/               # Mongoose models
│   └── [entity].model.js
├── controllers/          # Business logic
│   └── [entity].controller.js
├── routes/               # API endpoints
│   └── [entity].routes.js
└── docs/                 # API documentation
    └── [entity]_api_documentation.txt
```

## Usage

### Step 1: Generate Schema with ChatGPT

Use this prompt in ChatGPT:

```
You are a database architect for Node.js backends using Mongoose. When I provide an entity name, immediately generate a complete JSON schema based on industry standards for that entity type. Use common backend patterns to infer appropriate fields, data types, validations, and relationships. For a User entity, include authentication fields with proper validation, roles, and status flags. For Product, include pricing, inventory, and categorization. For Order, include customer references, items array, and status tracking. Each field should have appropriate Mongoose properties: data types, required flags, unique constraints, length limits, enumerations for fixed options, default values, format validations like email regex, and ObjectId references where relationships exist. Always include createdAt and updatedAt timestamps. Output valid, indented JSON ready for Mongoose implementation. After generation, I'll request modifications if needed. Generate my first schema when I provide the entity name.
```

Provide your entity name (e.g., "Teacher", "Product", "Order")

Save output as `schemas/[entityname]_schema.json`

### Step 2: Generate Code with GitHub Copilot

In VS Code, create a comment with this prompt:

```
Read the JSON schema file from the schemas folder which contains a "name" field for the entity and a "schema" object with field definitions. Analyze my existing Node.js backend project structure and integrate this new entity seamlessly. If models, controllers, and routes folders exist, add the new entity files there following existing naming conventions and patterns. Match the code style, import statements, error handling, and file organization of existing entities. Create a Mongoose model that converts JSON types to Mongoose types with all validations, adds bcrypt password hashing and comparePassword method if password field exists. Generate a controller with standard CRUD functions (create, getAll, getById, update, delete) plus any entity-specific functions that make sense based on the schema fields - for example, if there's a status field add functions to update status, if there are array fields add functions to add or remove items, if there's authentication add login/logout functions, if there are relationships add functions to populate related data. Create routes file with REST endpoints for all controller functions. If an index or main routes file exists, add import and registration for this new entity. Use appropriate HTTP methods and status codes throughout. After generating all code files, create a new file called docs/[entityname]_api_documentation.txt in plain text format that contains: the entity name, base URL as http://localhost:3000, a list of all endpoints with their HTTP methods and full paths, for each endpoint describe the purpose, list all request body fields with their types and validation rules from the schema, specify which fields are required and which are optional, show example valid request payloads in JSON format, list all possible response status codes with descriptions, and include the complete schema definition from the JSON file. Format this documentation file so it can be directly copied and pasted into Postman AI for test generation.
```

Copilot will generate:
- Model file with validations
- Controller with CRUD + custom functions
- Routes file with REST endpoints
- API documentation in TXT format

### Step 3: Generate Tests with Postman AI

1. Open Postman desktop app
2. Click Postbot icon (sparkle/star)
3. Copy content from `docs/[entityname]_api_documentation.txt`
4. Paste into Postbot with this prompt:

```
Based on this API documentation, generate a complete Postman collection with at least 15 test requests covering: valid requests with sample data matching the schema, invalid requests testing each validation rule (missing required fields, wrong data types, duplicate unique fields, invalid enum values, string length violations), tests for non-existent resource IDs, and edge cases. For each request, add test scripts that verify correct status codes and response structure.
```

5. Postbot generates complete test collection
6. Run collection to validate your API

## Example: Teacher Entity

**Input to ChatGPT:**
```
Teacher
```

**Generated Schema:**
```json
{
  "name": "Teacher",
  "schema": {
    "firstName": { "type": "String", "required": true, "maxlength": 50 },
    "email": { "type": "String", "required": true, "unique": true },
    "subjects": [{ "type": "String" }],
    ...
  }
}
```

**Generated Files:**
- `models/teacher.model.js`
- `controllers/teacher.controller.js`
- `routes/teacher.routes.js`
- `docs/teacher_api_documentation.txt`

**Generated Tests:**
- 15+ test cases in Postman collection
- Validation tests, edge cases, error scenarios

## Results

- **Manual Time:** 30-45 minutes per entity
- **AI Workflow Time:** 10-15 minutes per entity
- **Time Saved:** 65-70%
- **Benefits:** Consistent code, comprehensive tests, reduced errors

## Technologies

- Node.js
- Express.js
- Mongoose
- bcrypt
- ChatGPT (OpenAI)
- GitHub Copilot
- Postman AI (Postbot)

## Author

Eugene Dokye Anokye  
AmaliTech Applied AI & Prompt Engineering Course

## License

MIT

---

This README provides complete setup and usage instructions for anyone wanting to replicate your workflow. Does this work for your project?