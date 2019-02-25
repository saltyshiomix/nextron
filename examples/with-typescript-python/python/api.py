from flask import Flask
from flask_cors import CORS
from graphene import ObjectType, String, Schema
from flask_graphql import GraphQLView
from calc import calc as real_calc
import argparse
import os

#
# Notes on setting up a flask GraphQL server
# https://codeburst.io/how-to-build-a-graphql-wrapper-for-a-restful-api-in-python-b49767676630
#
# Notes on using pyinstaller to package a flask server (discussing issues that don't come up
# in this simple example but likely would come up in a more real application)
# for making pyinstaller see https://mapopa.blogspot.com/2013/10/flask-and-pyinstaller-notice.html
# and https://github.com/pyinstaller/pyinstaller/issues/1071
# and https://elc.github.io/posts/executable-flask-pyinstaller/
#

class Query(ObjectType):

#
# IMPORTANT - There is currently nothing preventing a malicious web page
#             running in the users web browser from making requests of this
#             server. If you add additional code here you will need to make
#             sure its either code that is appropriate for a malicious web
#             page to be able to run (like the calculator example below) or
#             that you wrap some kind of security model around the python
#             web server before adding the code.
#

    awake = String(description="Awake")
    def resolve_awake(self, args):
        return "Awake"

    exit = String(description="Exit")
    def resolve_exit(self, args):
        os._exit(0)
        return

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

parser = argparse.ArgumentParser()
parser.add_argument("--apiport", type=int, default=5000)
args = parser.parse_args()

app = Flask(__name__)
app.add_url_rule("/graphql/", view_func=view_func)
CORS(app) # Allows all domains to access the flask server via CORS

if __name__ == "__main__":
    app.run(port=args.apiport)
