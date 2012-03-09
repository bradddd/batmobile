Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon : false,
    onReady: function() {
		login();
	}
});

function login(){

	var wrapper = new Ext.Panel({
		fullscreen: true,
		layout: {
			type: 'vbox',
			pack: 'center',
			
		},
		items: [{
			title: 'Basic',
			xtype: 'form',
			id: 'basicform',
			scroll: 'vertical',
			items: 
			[
			{
				xtype: 'fieldset',
				title: 'Login Info',
				instructions: 'or go <a href="http://batsignal.herokuapp.com">here</a> to register',
				defaults: {
					// labelAlign: 'right'
					labelWidth: '35%'
				},
				items: 
				[
					{
						xtype: 'textfield',
						name: 'Username',
						label: 'Username',
						id: 'Username',
						useClearIcon: true
					}, 
					{
						xtype: 'passwordfield',
						name: 'password',
						label: 'Password',
						useClearIcon: true
					},
					{
						xtype: 'button',
						text: 'Login',
						algin: 'center',
						width: '35%',
						//width: '300px',
						//left: '100px',
						centered: true,
						ui: 'confirm',
						handler: function(sender,event){
							//alert('Submitted Login Form');
							load(Ext.getCmp('Username').getValue());
						},
					},
				]
			},			
			]
			
			
		}]
	});
	
}

function load(username){

	var rosterTimeline = new Ext.Component({
		title: 'Users on Agendo',
		cls: 'timeline',
		scroll: 'vertical',
		
		tpl: [
			'<tpl for=".">',
				'<div class="user">',
						'<div class="avatar"><img src="http://batsignal.herokuapp.com/assets{user.thumb_avatar_url}" /></div>',
						'<div class="user-name">',
							'<h2><a STYLE="text-decoration:none" href="http://batsignal.herokuapp.com{user.user_path}">{user.username}</a></h2>',
						'</div>',
				'</div>',
			'</tpl>'
		]
	});
	
	var agendasTimeline = new Ext.Component({
		title: 'My Agendas',
		cls: 'timeline',
		scroll: 'vertical',
		
		tpl: [
			'<tpl for=".">',
				'<div class="agenda">', 
					'<h2><a STYLE="text-decoration:none" href="http://batsignal.herokuapp.com{agenda.user_agenda_path}">{agenda.name}</a></h2>',                            
				'</div>',
			'</tpl>'
		]
	});

	var panel = new Ext.TabPanel({
		fullscreen: true,
		style: 'background-color: #E9F4FF;',
		items: [
				agendasTimeline,
				rosterTimeline,
			]
	});

	var rosterReader =  Ext.util.JSONP.request({
			url: 'http://batsignal.herokuapp.com/users.json',
			callbackKey: 'callback',
			
			callback: function(data) {
				//data = data.JSON;
				var stuff = data;
				for (var i = 0; i < stuff.length; i++) {
					var item = stuff[i];
					var s = item.user.thumb_avatar_url;
					item.user.thumb_avatar_url = s.substring(1);
				}
						
				rosterTimeline.update(stuff);
			}
	});
	
	var agendasReader =  Ext.util.JSONP.request({
			url: 'http://batsignal.herokuapp.com/users/'+username+'.json',
			callbackKey: 'callback',
			
			callback: function(data) {
				data = data.user.agendas;
				agendasTimeline.update(data);
			}
	});
}
		
