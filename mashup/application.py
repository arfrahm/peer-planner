import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

from cs50 import SQL
from helpers import lookup

# configure application
app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///planner.db")
db2 = SQL("sqlite:///mashup.db")

@app.route("/")
def index():
    """Render map."""
    if not os.environ.get("API_KEY"):
        raise RuntimeError("API_KEY not set")
    return render_template("index.html", key=os.environ.get("API_KEY"))
@app.route("/about", methods = ["GET", "POST"])
def about():
    return render_template("about.html")
@app.route("/faq", methods = ["GET", "POST"])
def faq():
    return render_template("faq.html")

@app.route("/articles")
def articles():
    """Look up articles for geo."""
    articles = lookup(request.args.get("geo"))
    # TODO
    return jsonify(articles)
@app.route("/create-event", methods = ["GET", "POST"])
def create_event():
    if (request.method == "POST"):
        # if not request.form.get("event_name"):
        #     return apology("Must name your event!")
        # if not request.form.get("event_time"):
        #     return apology("Must enter an event time!")
        # if not request.form.get("event_place"):
        #     return apology("Must enter an event location!")
        # if not request.form.get("attire"):
        #     return apology("Must enter an event attire!")
        # if not request.form.get("cost"):
        #     return apology("Must enter an event cost!")
        db.execute("INSERT INTO events (event_place, event_time, attire, cost, event_name) VALUES(:event_place, :event_time, :attire, :cost, :event_name)", event_name= request.form.get("event_name"),event_time = request.form.get("event_time"),event_place=request.form.get("event_place"),attire = request.form.get("attire"),cost = request.form.get("cost"));     return render_template("index.html")
    else:
        return render_template("create-event.html")
# @app.route("/filter")
# def filterEvents():
#     """Search for places that match query."""
#     # q = request.args.get("q") + "%"
#     # postal = db.execute("SELECT * FROM places WHERE postal_code LIKE :q OR place_name LIKE :q ", q=q)
#     #return jsonify(postal)
 

