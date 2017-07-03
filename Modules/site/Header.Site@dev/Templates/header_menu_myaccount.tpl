{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a class="header-menu-myaccount-anchor" href="#" data-action="push-menu" name="myaccount">
	{{translate 'My Account'}}
	<i class="header-menu-myaccount-menu-push-icon"></i>
</a>

<ul class="header-menu-myaccount">
	<li>
		<a href="#" class="header-menu-myaccount-back" data-action="pop-menu" name="back">
			<i class="header-menu-myaccount-pop-icon "></i>
			{{translate 'Back'}}
		</a>
	</li>
	<li class="header-menu-myaccount-overview">
		<a class="header-menu-myaccount-overview-anchor" href="#" data-touchpoint="customercenter" data-hashtag="#overview" name="accountoverview">
			{{translate 'Account Overview'}}
		</a>

		<a class="header-menu-myaccount-signout-link" href="#" data-touchpoint="logout" name="signout">
			<i class="header-menu-myaccount-signout-icon"></i>
			{{translate 'Sign Out'}}
		</a>
	</li>

    {{#each crudMenus}}
    <li class="header-menu-myaccount-item-level2">
        <a class="header-menu-myaccount-anchor-level2" href="#" data-touchpoint="customercenter" data-hashtag="#{{url}}"{{#if hasChildren}} data-action="push-menu"{{/if}} name="{{id}}">
            {{name}}
            <i class="header-menu-myaccount-menu-push-icon"></i>
        </a>
        {{#if hasChildren}}
        <ul class="header-menu-myaccount-level3">
            <li>
                <a href="#" class="header-menu-myaccount-back" data-action="pop-menu" name="back-level3">
                    <i class="header-menu-myaccount-pop-icon "></i>
                    {{translate 'Back'}}
                </a>
            </li>
            {{#each children}}
            <li data-permissions="{{purchasesPermissions}}">
                <a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#{{url}}" name="{{id}}">
                    {{name}}
                </a>
            </li>
            {{/each}}
        </ul>
        {{/if}}
    </li>
    {{/each}}

	<li class="header-menu-myaccount-item-level2">
        <a class="header-menu-myaccount-anchor-level2" href="#" data-touchpoint="customercenter" data-hashtag="#quotes" name="quotes">
            {{translate 'Completed Quotes'}}
            <i class="header-menu-myaccount-menu-push-icon"></i>
        </a>
        <br />
        <a class="header-menu-myaccount-anchor-level2" href="#" data-touchpoint="customercenter" data-hashtag="#documents" name="documents">
            {{translate 'Marketing Materials'}}
            <i class="header-menu-myaccount-menu-push-icon"></i>
        </a>
	</li>

	<!-- Settings -->
	<li class="header-menu-myaccount-item-level2">
		<a class="header-menu-myaccount-anchor-level2" tabindex="-1" href="#" data-action="push-menu" name="settings">
			{{translate 'Settings'}}
			<i class="header-menu-myaccount-menu-push-icon"></i>
		</a>
		<ul class="header-menu-myaccount-level3">
			<li>
				<a href="#" class="header-menu-myaccount-back" data-action="pop-menu" name="back-level3">
					<i class="header-menu-myaccount-pop-icon "></i>
					{{translate 'Back'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#profileinformation" name="profileinformation">
					{{translate 'Profile Information'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#emailpreferences" name="emailpreferences">
					{{translate 'Email Preferences'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#addressbook" name="addressbook">
					{{translate 'Address Book'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#creditcards" name="creditcards">
					{{translate 'Credit Cards'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" href="#" data-touchpoint="customercenter" data-hashtag="#updateyourpassword" name="updateyourpassword">
					{{translate 'Update Your Password'}}
				</a>
			</li>
		</ul>
	</li>

	{{#if isCaseModuleEnabled}}
	<li class="header-menu-myaccount-item-level2" data-permissions="lists.listCase.2">
		<a  class="header-menu-myaccount-anchor-level2" tabindex="-1" href="#" data-action="push-menu" name="cases">
			{{translate 'Cases'}}
			<i class="header-menu-myaccount-menu-push-icon"></i>
		</a>
		<ul class="header-menu-myaccount-level3">
			<li>
				<a href="#" class="header-menu-myaccount-back" data-action="pop-menu" name="back-level3">
					<i class="header-menu-myaccount-pop-icon "></i>
					{{translate 'Back'}}
				</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter" data-hashtag="#cases" name="allmycases">{{translate 'Support Cases'}}</a>
			</li>
			<li>
				<a class="header-menu-myaccount-anchor-level3" tabindex="-1" href="#" data-touchpoint="customercenter" data-hashtag="#newcase" name="submitnewcase">{{translate 'Submit New Case'}}</a>
			</li>
		</ul>
	</li>
	{{/if}}

</ul>