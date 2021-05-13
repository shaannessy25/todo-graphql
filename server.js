const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");


// Create a schema
const schema = buildSchema(`
    type Todo {
        name: String!
        completed: Boolean!
        date: String!
        id: ID!
    }

    type Query {
        getAllTodos: [Todo!]!
        getTodo(id: ID!): [Todo]!
        getCompletedTodos: [Todo!]!
        notCompletedTodos: [Todo!]!
    }

    type Mutation {
        addTodo(name: String!, completed: Boolean!, date: String!, id:Int!): Todo
        completeTodo( id: Int!, completed: Boolean!): Todo
    }
`);


const todoList = [
    {
        name: "Laundry",
        completed: true,
        date: "1/2/21",
        id: 1
    },
    {
        name: "Walk",
        completed: false,
        date: "3/12/21",
        id: 2
    }, 
    {
        name: "Project 1",
        completed: true,
        date: "5/22/21",
        id: 3
    }
]


//Define a resolver
const root = {
    getAllTodos: () => {
        return todoList
    },

    getTodo: ({ id }) => {
        return todoList.filter(item => item.id == id)
    },

    getCompletedTodos: () => {
        return todoList.filter(item => item.completed == true )
    }, 

    notCompletedTodos: () => {
        return todoList.filter(item => item.completed == false )
    },

    addTodo: ({ name, completed, date, id}) => {
        const newTodo = { name, completed, date, id}
        todoList.push(newTodo)
        return newTodo
    },

    completeTodos: ({ id, completed }) => {
        const completeList = todoList.filter(item => item.id == id)
        if(completeList.length === 0){
            return null
        }
        completeList[0].completed = completed
        return completeList[0]
    }

};

// Create an express app
const app = express();

// Define a route for GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start this app
const port = 4000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
