/*
 * L.Control.GeoSearch - search for an address and zoom to its location
 * https://github.com/smeijer/leaflet.control.geosearch
 */

L.GeoSearch = {};
L.GeoSearch.Provider = {};

L.GeoSearch.Result = function (x, y, label) {
    this.X = x;
    this.Y = y;
    this.Label = label;
};

L.Control.GeoSearch = L.Control.extend({
    options: {
        position: 'topcenter',
        showMarker: true
    },

    _config: {
        country: '',
        searchLabel: 'Search for an address ...',
        notFoundMessage: 'Sorry, that address could not be found.',
        messageHideDelay: 3000,
        zoomLevel: 18
    },

    initialize: function (options) {
        L.Util.extend(this.options, options);
        L.Util.extend(this._config, options);
    },

    onAdd: function (map) {
        var $controlContainer = map._controlContainer,
            nodes = $controlContainer.childNodes,
            topCenter = false;

        for (var i = 0, len = nodes.length; i < len; i++) {
            var klass = nodes[i].className;
            if (/leaflet-top/.test(klass) && /leaflet-center/.test(klass)) {
                topCenter = true;
                break;
            }
        }

        if (!topCenter) {
            var tc = document.createElement('div');
            tc.className += 'leaflet-top leaflet-center';
            $controlContainer.appendChild(tc);
            map._controlCorners.topcenter = tc;
        }

        this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-geosearch');
		
		// add listener to addressSearch button
		var addressSearch = L.DomUtil.get("addressSearch");
        this._addressSearch = addressSearch;

		// add listener to refreshMap button
		var refreshMap = L.DomUtil.get("refreshMap");
		if (refreshMap) {
	        this._refreshMap = refreshMap;
			L.DomEvent.addListener(this._refreshMap, 'click', this._onRefreshMap, this);		
		}

        var searchbox = document.createElement('input');
        searchbox.id = 'leaflet-control-geosearch-qry';
        searchbox.type = 'text';
		searchbox.className = 'form-control';
        searchbox.placeholder = this._config.searchLabel;
        this._searchbox = searchbox;
		
        var msgbox = document.createElement('div');
        msgbox.id = 'leaflet-control-geosearch-msg';
        msgbox.className = 'leaflet-control-geosearch-msg';
        this._msgbox = msgbox;

        var resultslist = document.createElement('ul');
        resultslist.id = 'leaflet-control-geosearch-results';
        this._resultslist = resultslist;

        this._msgbox.appendChild(this._resultslist);
        this._container.appendChild(this._searchbox);
        this._container.appendChild(this._msgbox);

        L.DomEvent
          .addListener(this._container, 'click', L.DomEvent.stop)
          .addListener(this._searchbox, 'keypress', this._onKeyUp, this)
          .addListener(this._searchbox, 'blur', this._onBlur, this)
          .addListener(this._addressSearch, 'click', this._onSearchButton, this);
		  
        L.DomEvent.disableClickPropagation(this._container);

        return this._container;
    },

    geosearch: function (qry) {
        try {						
            var provider = this._config.provider;

            if(typeof provider.GetLocations == 'function') {
                var results = provider.GetLocations(qry, function(results) {
                    this._processResults(results);
                }.bind(this));
            }
            else {
                var url = provider.GetServiceUrl(qry);
                this.sendRequest(provider, url);
            }
        }
        catch (error) {
            this._printError(error);
        }
    },

    sendRequest: function (provider, url) {
        var that = this;

        window.parseLocation = function (response) {
            var results = provider.ParseJSON(response);
            that._processResults(results);

            document.body.removeChild(document.getElementById('getJsonP'));
            delete window.parseLocation;
        };

        function getJsonP (url) {
            url = url + '&callback=parseLocation'
            var script = document.createElement('script');
            script.id = 'getJsonP';
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        }

        if (XMLHttpRequest) {
            var xhr = new XMLHttpRequest();

            if ('withCredentials' in xhr) {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText),
                                results = provider.ParseJSON(response);

                            that._processResults(results);
                        } else if (xhr.status == 0 || xhr.status == 400) {
                            getJsonP(url);
                        } else {
                            that._printError(xhr.responseText);
                        }
                    }
                };

                xhr.open('GET', url, true);
                xhr.send();
            } else if (XDomainRequest) {
                var xdr = new XDomainRequest();

                xdr.onerror = function (err) {
                    that._printError(err);
                };

                xdr.onload = function () {
                    var response = JSON.parse(xdr.responseText),
                        results = provider.ParseJSON(response);

                    that._processResults(results);
                };

                xdr.open('GET', url);
                xdr.send();
            } else {
                getJsonP(url);
            }
        }
    },

    _processResults: function(results) {
        if (results.length > 0) {
            this._map.fireEvent('geosearch_foundlocations', {Locations: results});
            this._showLocation(results[0]);
			//set latitude and longitude for hidden form
			var latitude = results[0].Y;
			var longitude = results[0].X;
			latitude = latitude.toFixed(6);
			longitude = longitude.toFixed(6);
			$('#id_latitude').val(latitude);
			$('#id_longitude').val(longitude);
			var address = $('#leaflet-control-geosearch-qry').val();
			$('#id_address').val(address);			
        } else {
            this._printError(this._config.notFoundMessage);
        }
    },

    _showLocation: function (location) {
        if (this.options.showMarker == true) {
            if (typeof this._positionMarker === 'undefined')
                this._positionMarker = L.marker([location.Y, location.X]).addTo(this._map);
            else
                this._positionMarker.setLatLng([location.Y, location.X]);
        }

        this._map.setView([location.Y, location.X], this._config.zoomLevel, false);
        this._map.fireEvent('geosearch_showlocation', {Location: location});
    },

    _printError: function(message) {
        var elem = this._resultslist;
        elem.innerHTML = '<li>' + message + '</li>';
        elem.style.display = 'block';

        setTimeout(function () {
            elem.style.display = 'none';
        }, 3000);
    },

    _onKeyUp: function (e) {				
        var esc = 27,
            enter = 13,
            queryBox = document.getElementById('leaflet-control-geosearch-qry');

        if (e.keyCode === esc) { // escape key detection is unreliable
            queryBox.value = '';
            this._map._container.focus();
        } else if (e.keyCode === enter) {
			// prevent default enter action
			L.DomEvent.preventDefault(e);
			
			// remove marker if one exists
	        if (typeof marker === 'undefined') {
	        	// do nothing
	        } else {
				this._map.removeLayer(marker);
	        } 
			
			// run the address query
            this.geosearch(queryBox.value);
        }
    },
	
    _onBlur: function (e) {
        if (typeof marker === 'undefined') {
        	// do nothing
        } else {
			this._map.removeLayer(marker);
        } 
		
        var queryBox = document.getElementById('leaflet-control-geosearch-qry');
        this.geosearch(queryBox.value);
    },

    _onSearchButton: function (e) {
        if (typeof marker === 'undefined') {
        	// do nothing
        } else {
			this._map.removeLayer(marker);
        } 
		
        var queryBox = document.getElementById('leaflet-control-geosearch-qry');
        this.geosearch(queryBox.value);
    },

    _onRefreshMap: function (e) {
        if (typeof marker === 'undefined') {
        	// do nothing
        } else {
			this._map.removeLayer(marker);
        } 
		
        if (typeof this._positionMarker === 'undefined') {
        	// do nothing
        } else {
        	this._map.removeLayer(this._positionMarker);
        }   		
		this._map.setView([40.7429,-73.9188], 11);
		$('#id_latitude').val(null);
		$('#id_longitude').val(null);
		$('#id_address').val('')
		$('#leaflet-control-geosearch-qry').attr("value", '')			
		
    }
	
});
