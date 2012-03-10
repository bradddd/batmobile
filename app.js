Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {
 
		var form = new Ext.Panel({
			xtype: 'form',
			items: [
			{
				xtype: 'textfield',
				name : 'username',
				id: 'username',
				label: 'Username',
				labelAlign: 'center',
				useClearIcon: true,
			}, {
				xtype: 'passwordfield',
				name : 'password',
				id: 'password',
				label: 'Password',
				labelAlign: 'center',
				useClearIcon: false,
			}]
		});
 
       
        var formBase = new Ext.Panel({
		
            //scroll : 'vertical',
            //url    : 'http://batsignal.herokuapp.com/login',
            //standardSubmit : true,
			//method: 'POST',
			//scrollable: false,
			
			items: [
                {
                    padding: '15px',
					height: '100%',
					xtype: 'fieldset',
					id: 'fieldset',
                    title: 'Login',
					scrollable: false,
                    instructions: 'or go <a href="http://batsignal.herokuapp.com">here</a> to register',
                    defaults: {
                        labelAlign: 'center',
                        labelWidth: '40%',
                    },
					items:[form
					]
			}],
       
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
					layout: { pack: 'right' },
                    items: [
                        {
                            text: 'Login',
                            ui: 'confirm',
							handler: function(){
							
								var uname  = Ext.getCmp('username').getValue();
								Ext.Ajax.request({ 
									url:'http://batsignal.herokuapp.com/login',
									method:'POST',
									params: {
										password: Ext.getCmp('password').getValue(),
										username: uname,
									},
									failure: function (response) { 
										alert('failure');
									},
									success: function (response, opts) { 
										//alert('success');
										var page = response.responseText;
										if(page.indexOf('<a href="/users/'+uname+'">') !== -1) {
											load(uname);
											formBase.destroy();
											form.destroy();
										}
										else {
											alert('Login Failed');
										}
									},
								});
							}
                        }
                    ]
                }
            ]
        });
       
	
		
        if (Ext.is.Phone) {
            //formBase.fullscreen = true;
			Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false,
            });
        } else {
            Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false,
                height: 285,
                width: 480
            });
        }     
		
        formBase.show();		
    }
});

//formBase.render('login-form');

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