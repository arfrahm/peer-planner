import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

from cs50 import SQL

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

@app.route("/", methods = ["GET", "POST"])
def index():
    """Render map."""
   
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
        print(request.form)
       # print(request.args.get("lat"))
        db.execute("INSERT INTO events (event_place, event_time, attire, cost, event_name,lat,lng) VALUES(:event_place, :event_time, :attire, :cost, :event_name,:lat,:lng)", event_name= request.form.get("event_name"),event_time = request.form.get("event_time"),event_place=request.form.get("event_place"),attire = request.form.get("attire"),cost = request.form.get("cost"),lat=request.form.get("lat"),lng=request.form.get("lng"));     return render_template("index.html")
        return render_template("index.html")
    else:
        return render_template("index.html")



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
        #     return apolog y("Must enter an event location!")
        # if not request.form.get("attire"):
        #     return apology("Must enter an event attire!")
        # if not request.form.get("cost"):
        #     return apology("Must enter an event cost!")
        db.execute("INSERT INTO events (event_place, event_time, attire, cost, event_name) VALUES(:event_place, :event_time, :attire, :cost, :event_name)", event_name= request.form.get("event_name"),event_time = request.form.get("event_time"),event_place=request.form.get("event_place"),attire = request.form.get("attire"),cost = request.form.get("cost"));     return render_template("index.html")
        return render_template("create-event.html")

    else:
        return render_template("create-event.html")
# @app.route("/filter")
# def filterEvents():
#     """Search for places that match query."""
#     # q = request.args.get("q") + "%"
#     # postal = db.execute("SELECT * FROM places WHERE postal_code LIKE :q OR place_name LIKE :q ", q=q)
#     #return jsonify(postal)

@app.route("/search")
def search():
    """Search for places that match query."""
    q = request.args.get("q") + "%"
    postal = db.execute("SELECT * FROM places WHERE postal_code LIKE :q OR place_name LIKE :q ", q=q)
    return jsonify(postal)
 

@app.route("/update")
def update():
    """Find up to 10 places within view."""

    # # ensure parameters are present
    # if not request.args.get("sw"):
    #     raise RuntimeError("missing sw")
    # if not request.args.get("ne"):
    #     raise RuntimeError("missing ne")

    # # ensure parameters are in lat,lng format
    # if not re.search("^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$", request.args.get("sw")):
    #     raise RuntimeError("invalid sw")
    # if not re.search("^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$", request.args.get("ne")):
    #     raise RuntimeError("invalid ne")

    # # explode southwest corner into two variables
    # (sw_lat, sw_lng) = [float(s) for s in request.args.get("sw").split(",")]

    # # explode northeast corner into two variables
    # (ne_lat, ne_lng) = [float(s) for s in request.args.get("ne").split(",")]

    # # find 10 cities within view, pseudorandomly chosen if more within view
    # if (sw_lng <= ne_lng):

    #     # doesn't cross the antimeridian
    #     rows = db.execute("""SELECT * FROM places
    #         WHERE :sw_lat <= latitude AND latitude <= :ne_lat AND (:sw_lng <= longitude AND longitude <= :ne_lng)
    #         GROUP BY country_code, place_name, admin_code1
    #         ORDER BY RANDOM()
    #         LIMIT 10""",
    #         sw_lat=sw_lat, ne_lat=ne_lat, sw_lng=sw_lng, ne_lng=ne_lng)

    # else:

    #     # crosses the antimeridian
    #     rows = db.execute("""SELECT * FROM places
    #         WHERE :sw_lat <= latitude AND latitude <= :ne_lat AND (:sw_lng <= longitude OR longitude <= :ne_lng)
    #         GROUP BY country_code, place_name, admin_code1
    #         ORDER BY RANDOM()
    #         LIMIT 10""",
    #         sw_lat=sw_lat, ne_lat=ne_lat, sw_lng=sw_lng, ne_lng=ne_lng)
    
    rows = db.execute("""SELECT * FROM events""");

    # output places as JSON

    return jsonify(rows)
@app.route("/filter", methods=["GET"])
def filter():
    
    print(request.args.get("keyword"))
    rows = db.execute("""SELECT * FROM events WHERE (event_name LIKE :keyword) """,keyword="%"+request.args.get("keyword")+"%");
    print(rows)
    return jsonify(rows)
