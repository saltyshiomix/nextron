from flask import Flask
from flask_cors import CORS
from graphene import ObjectType, String, Schema
from flask_graphql import GraphQLView
from calc import calc as real_calc
#
# Notes on setting up a flask GraphQL server
#
# https://codeburst.io/how-to-build-a-graphql-wrapper-for-a-restful-api-in-python-b49767676630

#
# Notes on using pyinstaller to package a flask server (discussing issues that don't come up
# in this simple example but likely would come up in a more real application)
#
# for making pyinstaller see https://mapopa.blogspot.com/2013/10/flask-and-pyinstaller-notice.html
# and https://github.com/pyinstaller/pyinstaller/issues/1071
# and https://elc.github.io/posts/executable-flask-pyinstaller/

# example http://127.0.0.1:5000/graphql/?query=%7Bcalc(math%3A%223%20%2B%204%22)%7D

class Query(ObjectType):

    hello = String(description="Hello")
    def resolve_hello(self, args):
        return "World"
    
    calc = String(description="Calculator", math=String(required=True))
    def resolve_calc(self, info, math):
        """based on the input text, return the int result"""
        try:
            return real_calc(math)
        except Exception:
            return 0.0
    
    echo = String(description="Echo", text=String(required=True))
    def resolve_echo(self, info, text):
        """echo any text"""
        return text

view_func = GraphQLView.as_view("graphql", schema=Schema(query=Query), graphiql=True)

app = Flask(__name__)
app.add_url_rule("/graphql/", view_func=view_func)
CORS(app) # Allows all domains to access the flask server via CORS

if __name__ == "__main__":
    app.run()
