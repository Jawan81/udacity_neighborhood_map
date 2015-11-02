Jawan's Places
==============

This is my version of the Front-End Nanodegree project #5 - the Neighborhood Map.

Installation
===========
To run the site on your computer either clone [this repository](https://github.com/Jawan81/udacity_neighborhood_map/) with Git:

```
git clone https://github.com/Jawan81/udacity_neighborhood_map.git .
```

or download and unzip the [repository's archive file](https://github.com/Jawan81/udacity_neighborhood_map/archive/master.zip)

If you don't have Gulp, Node.js and npm yet install them according to the instructions on [gulpjs.com](http://gulpjs.com).

Open your command line and go to the project's root path, install gulp dependencies and run the Gulp tasks.

```
# Go to project root
cd path/to/project
# Install dependencies
npm install
# run gulp tasks
gulp
```

Then open the index.html file in the repository with your favorite browser. No web server is required to run the project.

Usage
===

The site will show you interesting places of your favorite city it finds through different third-party APIs. If you move
the center of the map new places will be searched for you in the background. You can then filter your search by different
methods explained below.

## City Search
Start typing the first letters of your favorite city in the "City Search" input field. The app will try to determine the
city's full name by requesting the name from the Google Maps API and will present you a list of possible matches.
By clicking on one of the cities in the list the map will be centered to that city. The app will then search for
interesting places and will present them as map markers on the map and as the "Active Places List" in the left panel.

## The Map
On the map you see all currently active places indicated by different markers. Their shape give you a hint about the
type of the place. By clicking on one of the markers it will start to bounce and an Info Box is opened for you. It contains
information retrieved from the API, sometimes with photos or a link to the website of the place.

## Storage
The city and the places on the map are stored in the "local storage" of the browser so that they will be restored
when you revisit the website after having closed the browser tab.

## Filtering

### Filter By Name
By typing into the "Filter By Name" input field the places shown on the map and in the "Active Places" list are restricted
to places that contain what you've just typed into the field. So you can search for "Museum" and only places that contain
this word will be presented to you.

### Services Filter
The three checkboxes under "Services" activate or de-activate the usage of the different APIs to retrieve places. By
un-selecting one places that were retrieved through that API will not be presented to you anymore. Further searches will
also not use this API then.

### Places Filter
With these checkboxes you can filter the places according to their type: Eating, Shopping or Sight. Only places matching
your choices will be presented to you.

## Active Places List
With the Active Places list you can scroll through all places shown on the map and by selecting one you will jump to
its location and an info box with the same information is opened that you'll get when you click on the marker directly.


