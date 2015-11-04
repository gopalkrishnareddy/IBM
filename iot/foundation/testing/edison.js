// Packages
var jsonfile = require( 'jsonfile' );
var mqtt = require( 'mqtt' );
var path = require( 'path' );

// Configuration
var configuration = jsonfile.readFileSync( path.join( __dirname, '..', 'configuration.json' ) );

// Connection parameters
// Format: d:org_id:device_type:device_id
// URI: org_id.messaging.internetofthings.ibmcloud.com
var id = 
	'd:' + 
	configuration.organizationId + ':' +
	'Edison' + ':' +
	'FashionFinder';
var uri = 
	'tcp://' + 
	configuration.uri + ':' +
	'1883';

// Debug
console.log( id );
console.log( uri );

// Connect
var client = mqtt.connect( uri, {
	clientId: id,
	clean: true,
	username: 'use-token-auth',
	password: configuration.devices[4].authenticationToken
} ); 
 
// Connected
client.on( 'connect', function() {
	// Debug
	console.log( 'Connected.' );

	// Subscribe
	// command_id can be '+' wildcard
	// Topic: iot-2/cmd/command_id/fmt/format_string
	/*
	client.subscribe( 'iot-2/cmd/testing/fmt/json', function( error, granted ) {
		if( error ) 
		{
			console.log( error );
		} else {
			console.log( granted );
		}
	} );
	*/

	// Incrementally publish
	setInterval( function() {
		var data = null;
		var temperature = null;
		
		// Random temperature
		temperature = Math.random() * 100;
		
		// Build object to send
		// Single 'd' property
		data = {
			d: {
				fahrenheit: temperature,
				celcius: ( temperature - 32 ) * ( 5 / 9 ),
				humidity: Math.random() * 100
			}
		};

		// Publish object
		// JSON string
		// Topic: iot-2/evt/event_id/fmt/format_string
		client.publish( 'iot-2/evt/weather/fmt/json', JSON.stringify( data ), function() {
			console.log( data );
		} );							
	}, 1000 );
} );

/*
// Message
client.on( 'message', function( topic, message ) {
	console.log( message.toString() );
} );
*/
