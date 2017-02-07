{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<li class="store-locator-list-box" data-id={{storeId}}>
	<a href="stores/details/{{storeId}}">
		<div class="store-locator-list-box-count">
			<div>{{index}}</div>
		</div>
		<ul class="store-locator-list-box-info">
			<li>
				<strong class="store-locator-list-box-info-name">{{storeName}}</strong>
			</li>
			<li class="store-locator-list-box-details">
			<div class="store-locator-list-box-distance">{{storeDistance}} {{distanceUnit}}</div>
			<div class="store-locator-list-box-address">{{storeAddress}}</div>
			</li>
		</ul>
		<a href="stores/details/{{storeId}}" class="store-locator-list-box-arrow-container">
		<i class="store-locator-list-box-arrow-icon"></i>
		</a>
	</a>
</li>
