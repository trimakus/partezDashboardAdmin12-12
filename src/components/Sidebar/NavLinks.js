// sidebar nav links
export default {
	category1: [
		{
			"menu_title": "sidebar.dashboard",
			"menu_icon": "zmdi zmdi-view-dashboard",
			"path": "/app/dashboard/ecommerce",
			"child_routes":null
		},
	],
	category2: [
		{
			"menu_title": "sidebar.users",
			"menu_icon": "zmdi zmdi-accounts",
			"child_routes": [
				{
					"path": "/app/users/user-management",
					"menu_title": "sidebar.userManagement"
				},
				{
					"path": "/app/users/staff-management",
					"menu_title": "sidebar.staffManagement"
				},
			]
		},
		{
			"menu_title": "sidebar.games",
			"menu_icon": "zmdi zmdi-widgets",
			"path": "/app/games",    //ce qui est annoncé au niveau routeservices
			"child_routes": null
		},
		{
			"menu_title": "sidebar.events",
			"menu_icon": "zmdi zmdi-calendar-note",
			"path": "/app/events",    //ce qui est annoncé au niveau routeservices
			"child_routes": null
		},
		{

			"menu_title": "sidebar.ads",
			"menu_icon": "zmdi zmdi-widgets",
			"child_routes": [
				{
					"path": "/app/ads/signIn",
					"menu_title": "widgets.signInAd"

				},
				{
					"path": "/app/ads/signUp",
					"menu_title": "widgets.signUpAd"
				},
				{
					"path": "/app/ads/home",
					"menu_title": "widgets.homeAd"
				},
				{
					"path": "/app/ads/myEvents",
					"menu_title": "widgets.myEventsAd"
				},
				{
					"path": "/app/ads/friends",
					"menu_title": "widgets.friendsAd"
				},
				{
					"path": "/app/ads/games",
					"menu_title": "widgets.gamesAd"
				},
			]
		},
		{
			"menu_title": "sidebar.rolesManagement",
			"menu_icon": "zmdi zmdi-widgets",
			"child_routes": [
				{
					"path": "/app/roles_Permissions/roles",
					"menu_title": "sidebar.roles"
				},
				{
					"path": "/app/roles_Permissions/permissions",
					"menu_title": "sidebar.permissions"
				},

			]
		},
	],
	category3: [
		{
			"menu_title": "sidebar.aboutUs",
			"menu_icon": "zmdi zmdi-info",
			"path": "/app/about-us",
			"child_routes": null
		}
	],
	category4: [
		{
			"menu_title": "sidebar.chat",
			"menu_icon": "zmdi zmdi-comments",
			"path": "/app/chat",
			"child_routes": null
		}
],
}
