{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="store-locator-details-main">
	<div class="store-locator-details-main-container">
		<div class="store-locator-details-main-container-box">
			<div class="store-locator-details-main-container-box-wrap">
				<h1>{{title}}</h1>
			</div>
		</div>

		<div class="store-locator-details-main-container">
			<div class="store-locator-details-main-left">
				<div class="store-locator-details-main-pusher">
					<div class="store-locator-details-main-details-info" data-view="DetailsInfo">
						<div class="store-locator-details-main-nav-back">
							<a href="{{redirectUrl}}">{{translate '< Back to list of stores'}}</a>
						</div>
						<div class="store-locator-details-store">
							<h4>{{storeName}}</h4>
							<p class="store-locator-details-store-info">
								{{#if showStoreAddress}}
									<span class="store-locator-details-address">{{storeAddress}}</span>
								{{/if}}
								{{#if showStoreCity}}
									<span class="store-locator-details-city">{{storeCity}}</span>{{/if}}{{#if showStoreState}}, <span class="store-locator-details-state">{{storeState}}</span>{{/if}}{{#if showStoreZipCode}}, <span class="store-locator-details-zipcode">{{storeZipCode}}</span>
								{{/if}}
							</p>
							<a class="store-locator-details-get-directions-link" target="_blank" href={{directionUrl}}>{{translate 'Get directions'}}</a>
							{{#if showStorePhone}}
							<p><span class="store-locator-details-phone-label">{{translate 'Phone:'}} </span> <a class="store-locator-details-phone-value" href="tel:{{storePhone}}">{{storePhone}}</a></p>
							{{/if}}
							{{#if showServiceHours}}
							<p><span class="store-locator-details-hours-label">{{translate 'Opening Hours:'}} </span><span class="store-locator-details-hours-value">{{serviceHours}}</span></p>
							{{/if}}
						</div>
					</div>
				</div>
			</div>
			<div class="store-locator-details-main-right">
				<div class="store-locator-details-map" data-view="LocatorMap" data-type="map-view"></div>
				<div class="store-locator-details-get-directions-button-container">
				<a class="store-locator-details-get-directions-button" target="_blank" href={{directionUrl}}>{{translate 'Get directions'}}</a>
				</div>
			</div>
		</div>
	</div>
</div>
