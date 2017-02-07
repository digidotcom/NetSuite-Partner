{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="store-locator-location">
	{{#if showList}}
	<div class="store-locator-location-list-view">
		<div class="store-locator-location-pusher">
			<div class="store-locator-location-nav-back">
				<a href="#" data-action="refine-search">{{translate '< Back to Refine Search'}}</a>
			</div>
			<div class="store-locator-location-nav-button-container">
				<div class="store-locator-location-nav-button-container-grid">
					<button class="store-locator-location-nav-button-list active" data-action="show-list"> {{translate 'List View'}} </button>
				</div>
				<div class="store-locator-location-nav-button-container-grid">
					<button class="store-locator-location-nav-button-map" data-action="show-map"> {{translate 'Map View'}} </button>
				</div>
			</div>
			<div class="store-locator-location-nav-description">
				<span class="store-locator-location-nav-description-highlight">{{totalStores}} {{translate 'stores'}}</span> {{translate 'near'}} <span class="store-locator-location-nav-description-geolocation">"{{myposition}}"</span>
			</div>
			<div class="store-locator-location-list" data-id="list-view" data-type="list-view">
				<ul class="store-locator-location-list-container"  data-view="LocatorList"></ul>
			</div>
		</div>
	</div>
	{{else}}
	<div class="store-locator-location-search-view">
			{{#if showLocalizationMap}}
				<div id="map-localization" class="store-locator-location-map-localization" data-view="LocalizationMap"></div>
			{{/if}}

			<div class="store-locator-location-enter-location" data-type="location-enter">
				<label>{{translate 'Enter Address, Zip Code or City'}}</label>
				<input id="autocomplete" class="store-locator-location-input-autocomplete"/>
				<div class="store-locator-location-geolocation-message-error" data-action="message-error">
					{{translate 'Please select a valid address.'}}
				</div>
				<div class="store-locator-location-buttons-container">
					<div class="store-locator-location-buttons-container-find">
					<button class="store-locator-location-button-find" data-action="find-stores"> {{translate 'Find Stores'}} </button>
					</div>
					<div class="store-locator-location-buttons-container-or-wrap">
						<div class="store-locator-location-buttons-container-or" data-type="geolocation-or"><span>{{translate 'or'}}</span></div>
					</div>

					<div class="store-locator-location-buttons-container-geolocalization" data-type="geolocation-button">
					<button class="store-locator-location-button-current" data-action="show-geolocation">
					<i class="store-locator-location-button-current-icon"></i> {{translate 'Use Current Location'}} </button>
					</div>
				</div>

				<div class="store-locator-location-geolocation" data-type="location-geolocation">
				<div class="store-locator-location-geolocation-message-warning" data-action="message-warning">
					{{translate 'To use this functionality enable geolocation.'}}
				</div>
			</div>
		</div>
	</div>
	{{/if}}
	<a class="store-locator-location-see-all-stores" href="stores/all">{{translate 'See complete list of stores'}}</a>
</div>