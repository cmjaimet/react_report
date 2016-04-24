var cpReporting = {
	report_name: 'corepress',
	Reports: {
		categories: { label: 'Categories', heads: [ 'Name', 'Slug', 'Sidebar', 'Video', 'Feed', 'Sponsorship', 'Image', 'Content Widgets' ] },
		menus: { label: 'Menus', heads: [ 'Menu', 'Items' ] },
		sidebars: { label: 'Sidebars', heads: [ 'Title', 'Widgets', 'Categories' ] },
		skedtool: { label: 'Skedtool', heads: [ 'Name', 'Color' ] },
		tags: { label: 'Tags', heads: [ 'Name', 'Slug' ] },
		feeds: { label: 'Feeds', heads: [ 'ID', 'Pages', 'Exists', 'Posts', 'Age' ] },
		videos: { label: 'Videos', heads: [ 'ID', 'Terms', 'Widgets', 'Exists' ] },
		widgets: { label: 'Widgets', heads: [ 'Widget', 'Settings', 'Sponsorship', 'Image' ] },
		zones: { label: 'Zones', heads: [ 'Name', 'Slug' ] },
		dfp_adparam: { label: 'DFP Params', heads: [ 'Key', 'Default', 'Global', 'Value' ] },
		dfp_adsites: { label: 'DFP Sites', heads: [ 'Label', 'Site', 'Criteria' ] },
		dfp_adsizes: { label: 'DFP Sizes', heads: [ 'Height',  'Width' ] },
		dfp_settings: { label: 'DFP Settings', heads: [ 'Element', 'Value' ] },
		dfp_adunits: { label: 'DFP Units', heads: [ 'Name',  'Slug', 'Sizes', 'Parameters' ] },
		all_feeds: { label: 'Broken Feeds', heads: [ 'ID', 'Markets' ] },
	},
	Newsrooms: {
		ch: { label: 'Calgary Herald', domain: 'postmediacalgaryherald2.wordpress.com' },
		ej: { label: 'Edmonton Journal', domain: 'postmediaedmontonjournal2.wordpress.com' },
		lp: { label: 'Regina LeaderPost', domain: 'postmedialeaderpost2.wordpress.com' },
		mg: { label: 'Montreal Gazette', domain: 'postmediamontrealgazette2.wordpress.com' },
		oc: { label: 'Ottawa Citizen', domain: 'postmediaottawacitizen2.wordpress.com' },
		sp: { label: 'Saskatoon StarPhoenix', domain: 'postmediathestarphoenix2.wordpress.com' },
		vp: { label: 'Vancouver Province', domain: 'theprovince.wpdqa3.canada.com' },
		vs: { label: 'Vancouver Sun', domain: 'postmediavancouversun2.wordpress.com' },
	},
	mode: '',
	market: '',
	check_sponsored: true,
	check_feed: false,
	getTitleCase: function( _str ) {
		if ( 'undefined' === typeof _str ) {
			return '';
		}
		return _str.replace( /\w\S*/g, function( _txt ){ return _txt.charAt(0).toUpperCase() + _txt.substr(1).toLowerCase(); } );
	},
	getFeedUrl: function( _url, _domain ) {
		var _label = _url;
		if ( 0 < 1 * _url ) {
			// SouthPARC
			_label = 'SP:' + _url;
			_url = 'http://app.canada.com/SouthPARC/service.svc/Content?callingSite=' + _domain + '&contentId=' + _url + '&format=atom&AllLinks=false&maxdocs=40';
		}
		return { url: _url, label: _label };
	},
	getNewsroomDomain: function() {
		return cpReporting.Newsrooms[ cpReporting.market ].domain;
	},
	getTermEditUrl: function( _cid, _typ, _data, _label ) {
		//console.log(_data );
		var _url = 'https://' + cpReporting.getNewsroomDomain() + '/wp-admin/';
		switch ( _typ ) {
			case 'h':
				_url += 'index.php?page=home_layout';
				_label = ( '' !== _label ) ? _label : 'Home';
				break;
			case 'c':
				_url += 'edit-tags.php?action=edit&taxonomy=category&post_type=post&tag_ID=' + _cid;
				_label = ( '' !== _label ) ? _label : _data.categories[ _cid ].name;
				break;
			case 't':
				_url += 'edit-tags.php?action=edit&taxonomy=post_tag&post_type=post&tag_ID=' + _cid;
				_label = ( '' !== _label ) ? _label : _data.tags[ _cid ].name;
				break;
			default:
				break;
		}
		return { label: _label, url: _url };
	},
	getNewsroomName: function( _mkt ) {
		return ( '' === _mkt ) ? 'All Markets' : cpReporting.Newsrooms[ _mkt ].label;
	},
	confirmOnPageExit: function ( e ) {
		if ( false === document.getElementById( 'pn_cp_offline_mode' ).checked ) {
			e.preventDefault();
			return;
		}
		e = e || window.event;
		var message = 'Sure?';
		// For IE6-8 and Firefox prior to version 4
		if ( e ) {
			e.returnValue = message;
		}
		// For Chrome, Safari, IE8+ and Opera 12+
		return message;
	},
	setCookie: function( _cname, _cval, _cdays ) {
		var d = new Date();
		d.setTime( d.getTime() + ( 365 * 24 * 60 * 60 * 1000 ) );
		var _expires = 'expires=' + d.toUTCString();
		document.cookie = _cname + '=' + _cval + ';' + _expires;
	},
	getCookie: function( _cname ) {
		var name = _cname + '=';
		var ca = document.cookie.split( ';' );
		for ( var i = 0; i < ca.length; i++ ) {
			var c = ca[ i ];
			while ( c.charAt(0) == ' ' ) c = c.substring( 1 );
			if ( c.indexOf( name ) == 0 ) return c.substring( name.length, c.length );
		}
		return '';
	},
	ObjectToArray: function( _obj ) {
		return Object.keys( _obj ).map( function(key) { return _obj[ key ] } );
	},
	SortObject: function( _obj, _field ) {
		// accepts an object, returns a sorted array
		var _ary_sorted = [];
		if ( 'pn_key' === _field ) {
			Object.keys( _obj ).sort().forEach( function( _elem, _idx ) {
				_ary_sorted[ _idx ] = { pn_key: _elem, pn_val: _obj[ _elem ] };
			} );
			//console.log( _ary_sorted ) ;
		} else {
		  cpReporting.ObjectToArray( _obj ).sort( function( a, b ) {
		    if ( a[ _field ].toLowerCase() > b[ _field ].toLowerCase() ) {
		      return 1;
		    }
		    if ( a[ _field ].toLowerCase() < b[ _field ].toLowerCase() ) {
		      return -1;
		    }
		    return 0;
		  } ).forEach( function( _elem, _idx ) {
		  	_ary_sorted[ _idx ] = _elem;
			} );
		}
		return _ary_sorted;
	},
	onChange: function () {
		cpReporting.report_name = cpReporting.market + '_' + cpReporting.mode;
		ReactDOM.render(
			<ReportWrapper mode={ cpReporting.mode } mkt={ cpReporting.market } />,
			document.getElementById('pn_cp_report_wrapper')
		);
	}
};

//cpReporting.market = Object.keys( cpReporting.Newsrooms )[0];

cpReporting.mode = Object.keys( cpReporting.Reports )[0];



window.onbeforeunload = cpReporting.confirmOnPageExit;

//console.log(cpReporting.getCookie( 'offline' ) );

/*
	Change this so it loads the JSON first, then renders a list of report links
	clicking a report link renders the table using the JSON
*/

var MenuModeRow = React.createClass( {
	handleClick: function() {
		// this.props.id is the type of report to show menu, skedtool, etc
		cpReporting.mode = this.props.id;
		cpReporting.onChange();
	},
	render: function() {
		return (
			<li ref={ this.props.id } onClick={ this.handleClick } className={ ( ( cpReporting.mode === this.props.id ) ? 'chosen' : '' ) }>{ this.props.label }</li>
		);
	}
} );

var MenuModes = React.createClass( {
	render: function() {
		var _rows = [];
		Object.keys( cpReporting.Reports ).forEach( function( _elem, _idx ) {
			_rows.push( <MenuModeRow key={ _idx } id={ _elem } label={ cpReporting.Reports[ _elem ].label } /> );
		} );
		return (
			<ul id="pn_cp_menu_modes">
				{ _rows }
			</ul>
		);
	}
} );

var MarketModeRow = React.createClass( {
	handleClick: function() {
		// this.props.id is the type of report to show menu, skedtool, etc
		cpReporting.market = this.props.id;
		//console.log(this.props.id);
		cpReporting.onChange();
	},
	render: function() {
		return (
			<li ref={ this.props.id } onClick={ this.handleClick } className={ ( ( this.props.id === cpReporting.market ) ? 'chosen' : '' ) }>{ this.props.label }</li>
		);
	}
} );

var MarketModes = React.createClass( {
	render: function() {
		var _rows = [];
		var _ary = Object.keys( cpReporting.Newsrooms );
		_ary.forEach( function (_elem, _idx ) {
			_rows.push( <MarketModeRow key={ _idx } id={ _elem } label={ cpReporting.Newsrooms[ _elem ].label } /> );
		} );
		_rows.push( <MarketModeRow key="-1" id="" label="All Markets" /> );
		return (
			<ul id="pn_cp_market_modes">{ _rows }</ul>
		);
	}
} );

var CheckboxSponsored = React.createClass( {
	handleClick: function() {
		cpReporting.check_sponsored = ! cpReporting.check_sponsored;
		cpReporting.onChange();
	},
	render: function() {
		return (
			<span><input type="checkbox" onChange={ this.handleClick } checked={ cpReporting.check_sponsored } />Sponsored only</span>
		);
	}
} );

var CheckboxFeed = React.createClass( {
	handleClick: function() {
		cpReporting.check_feed = ! cpReporting.check_feed;
		cpReporting.onChange();
	},
	render: function() {
		return (
			<span><input type="checkbox" onChange={ this.handleClick } checked={ cpReporting.check_feed } />Feed only</span>
		);
	}
} );


var ReportFilters = React.createClass( {
	render: function() {
		return (
			<div>
			<CheckboxSponsored />
			<CheckboxFeed />
			</div>
		);
	}
} );

var ReportCellList = React.createClass( {
	render: function() {
		var _data = this.props.data;
		if ( 'object' === typeof _data ) {
			return (
				<td>{
					Object.keys( _data ).map( function( l, _idx ) {
					return <span className="pn_cp_list_item">
							<a href={ _data[l].url } className={ '' === _data[l].url ? 'pn_cp_table_link_hide' : '' } key={ _idx }>{ _data[l].label }</a>
						</span>
					} ) 
				}</td>
			);
		} else {
			// nothing passed so return an empty cell
			return ( <td></td> );
		}
	}
} );

var ReportCellImage = React.createClass( {
	render: function() {
		var _aclass = 'pn_cp_table_link_hide';
		var _data = this.props.data;
		var _url = this.props.data.url;
		var _img = this.props.data.img;
		//console.log(this.props.data);
		if ( 'object' === typeof _data ) {
			if ( '' !== _url ) {
				return (
					<td><a href={ _url } className={ _aclass }>
					<img src={ _img } /></a>
					</td>
				);
			} else {
				return (
					<td><img src={ _img } /></td>
				);
			}
		} else {
			// nothing passed so return an empty cell
			return ( <td></td> );
		}
	}
} );

var ReportCellLabel = React.createClass( {
	getLabel: function() {
		var _label =  this.props.data.label;
		switch ( typeof _label ) {
			case 'boolean':
				_label = _label ? 'T' : 'F';
				break;
			case 'string':
			case 'number':
			default:
				break;
		}
		return _label;
	},
	getCellClass: function() {
		var _class = 'pn_cp_table_td_str';
		if ( 'string' === typeof this.props.data.clss ) {
			_class = 'pn_cp_message';
		} else if ( 'number' === typeof this.props.data.cols ) {
			_class = 'pn_cp_subhead';
		} else {
			switch ( typeof this.props.data.label ) {
				case 'string':
					_class = 'pn_cp_table_td_str';
					break;
				case 'number':
					_class = 'pn_cp_table_td_num';
					break;
				case 'boolean':
					_class = 'pn_cp_table_td_bool';
					break;
				default:
					break;
			}
		}
		return _class;
	},
	getCellContents: function() {
		if ( '' !== this.props.data.url ) {
			return <a href={ this.props.data.url } target="_blank">{ this.getLabel() }</a>
		} else {
			return this.getLabel()
		}
	},
	render: function() {
		if ( 'object' === typeof this.props.data ) {
			return (
				<td 
					className={ this.getCellClass() }
					colSpan={ ( ( 'number' === typeof this.props.data.cols ) ? this.props.data.cols : 1 ) }
					>{ this.getCellContents() }</td>
			);
		} else {
			// nothing passed so return an empty cell
			return ( <td></td> );
		}
	}
} );

var ReportRow = React.createClass( {
	render: function() {
		var cells = [];
		var _data = {};
		this.props.data.forEach( function( _elem, _idx ) {
			if ( 'object' === typeof _elem ) {
				switch ( _elem.mode ) {
					case 'list':
						cells.push( <ReportCellList key={ _idx } data={ _elem.data } /> );
						break;
					case 'image':
						cells.push( <ReportCellImage key={ _idx } data={ _elem.data } /> );
						break;
					case 'label':
					default:
						cells.push( <ReportCellLabel key={ _idx } data={ _elem.data } /> );
						break;
				}
			} else {
				// just a string
				//console.log( _idx ); // on feeds duplicates a child key prop ??
				cells.push( <ReportCellLabel key={ _idx } data={ { label: _elem } } /> );
			}
		} );
		return (
			<tr>{ cells }</tr>
		);
	}
} );

var ReportHead = React.createClass( {
	render: function() {
		return (
			<td>{ this.props.data }</td>
		);
	}
} );

var ReportTable = React.createClass( {
	displayRows: function( _mkt, _multi ) {
		var _rows = [];
		if ( true === _multi ) {
			_rows.push( <ReportRow key={ _mkt } data={ [ { mode: 'label', data: { label: cpReporting.Newsrooms[ _mkt ].label, cols: 8 } } ] } /> );
		}
		Object.keys( this.props.data.cats ).forEach( function( _elem, _idx ) {
			//console.log(_elem + '....' + _mkt);
			//if ( 'all' === _mkt ) {}
			if ( 'undefined' !== typeof this.props.data.cats[ _elem ][ _mkt ] ) {
				var _stype = '';
				var _scomp = '';
				var _surl = '';
				var _simg = '';
				var _feed = { mode: 'label', data: cpReporting.getFeedUrl( this.props.data.cats[ _elem ][ _mkt ].feed, cpReporting.Newsrooms[ _mkt ].domain ) };
				if ( '' !== this.props.data.cats[ _elem ][ _mkt ].spons ) {
					//console.log('SPONSORED');
					//console.log(this.props.data.cats[ _elem ][ _mkt ].spons);
					_stype = cpReporting.getTitleCase( this.props.data.cats[ _elem ][ _mkt ].spons.type.replace( '_', ' ' ) );
					_scomp = {
							mode: 'label',
							data: {
								label: this.props.data.cats[ _elem ][ _mkt ].spons.comp,
								url: this.props.data.cats[ _elem ][ _mkt ].spons.url,
							}
						};
					_simg = {
						mode: 'image',
						data: {
							img: this.props.data.cats[ _elem ][ _mkt ].spons.img,
							url: this.props.data.cats[ _elem ][ _mkt ].spons.url,
						}
					};
				}
				if ( 
					( ( ! cpReporting.check_sponsored ) || ( '' !== _stype ) ) &&
					( ( ! cpReporting.check_feed ) || ( '' !== this.props.data.cats[ _elem ][ _mkt ].feed ) ) 
					) {
					_rows.push( <ReportRow key={ _mkt+_idx } data={ [
						_elem,
						this.props.data.cats[ _elem ][ _mkt ].name,
						_feed,
						this.props.data.cats[ _elem ][ _mkt ].video,
						this.props.data.cats[ _elem ][ _mkt ].outfits,
						_stype,
						_scomp,
						_simg,
					] } /> );
				}
			}
		}.bind( this ) );
		if ( ( ( true === _multi ) && ( 1 >= _rows.length ) ) || ( 0 === _rows.length ) ) {
			// just the newsroom header so no rows
			_rows.push( <ReportRow key={ _mkt+'1' } data={ [ { mode: 'label', data: { label: '- No matches', cols: 8, clss: 'pn_cp_message' } } ] } /> );
		}
		return ( _rows );
	},
	render: function() {
		var _heads = [];
		var _rows = [];
		//var _mode = this.props.mode;
		//console.log('ReportTable: ' + cpReporting.market);
		if ( ! jQuery.isEmptyObject( this.props.data ) ) {
			if ( ! jQuery.isEmptyObject( this.props.data.cats ) ) {
				var _mode_ary = [];
				_mode_ary = [ 'Slug', 'Name', 'Feed', 'Video', 'Outfits', 'Sponsored', 'Company', 'Logo' ];
				var _mkt = cpReporting.market;
				//cpReporting.market.forEach() {}
				if ( '' === _mkt ) {
					Object.keys( cpReporting.Newsrooms ).forEach( function( _elem, _idx ) {
						_rows.push( this.displayRows( _elem, true ) );
					}.bind( this ) );
				} else {
					_rows.push( this.displayRows( _mkt, false ) );
				}
				_mode_ary.forEach( function( _ttl ) {
					_heads.push( <ReportHead key={ _ttl } data={ _ttl } /> );
				}.bind( this ) );
			}
		}
		return (
			<div id="pn_cp_report_wrapper">
				<div id="pn_cp_report_tools">
				</div>
				<div id="pn_cp_report_div">
					<table id="pn_cp_report_table">
						<thead>
							<tr>{ _heads }</tr>
						</thead>
						<tbody>{ _rows }</tbody>
					</table>
				</div>
			</div>
		);
	}
} );

var ButtonToExcel = React.createClass( {
	sendTableToExcel: (
		function () {
			var _uri = 'data:application/vnd.ms-excel;base64,';
			var _template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
			var _base64 = function ( s ) {
				return window.btoa( unescape( encodeURIComponent( s ) ) );
			};
			var _format = function ( s, c ) {
				return s.replace( /{(\w+)}/g, function (m, p) { return c[p]; } );
			};
			return function() {
				var _ctx = {
					worksheet: cpReporting.report_name,
					table: document.getElementById( 'pn_cp_report_div' ).innerHTML
				}
				document.getElementById( 'pn_cp_download_link' ).href = _uri + _base64( _format( _template, _ctx ) );
				document.getElementById( 'pn_cp_download_link' ).download = 'corepress_' + cpReporting.report_name + '.xls';
				document.getElementById( 'pn_cp_download_link' ).click();
			};
		}
	)(),
	render: function() {
		return (
			<input type="button" value="Export to Excel" className="pn_cp_button" onClick={ this.sendTableToExcel } />
		);
	}
} );

var ReportBox = React.createClass( {
	render: function() {
		return (
			<div className="ReportBox">
				<ReportTable data={ this.props.data } />
			</div>
		);
	}
} );

var ReportWrapper = React.createClass( {
	getInitialState: function() {
		return {
			data: {},
		};
	},
  handleUserInput: function( mode ) {
    this.setState( {
      data: { data },
    } );
  },
	componentDidMount: function() {
		var _data = {};
		var _count = 0;
		var _url = 'all_cats.json';
		this.serverRequest = $.get( _url, function( result ) {
			_data = result;
			_count ++;
			this.setState( {
				data: _data
			} );
			console.log( _data );
		}.bind( this ) );
	},
	render: function() {
		//var mode_ = this.props.mode;
		var title_ = '';
		Object.keys( cpReporting.Reports ).forEach( function( _elem ) {
			if ( _elem === cpReporting.mode ) {
				title_ = cpReporting.Reports[ _elem ].label;
			}
		} );
		return (
			<div className="PageWrapper">
				<div className="pn_cp_wrapper">
					<MarketModes markets={ this.props.markets } />
				</div>
				<div className="pn_cp_wrapper">
					<ReportFilters />
				</div>
				<div className="pn_cp_wrapper">
					<div className="pn_cp_report_title_wrapper">
						<div className="pn_cp_report_title">ReactJS Sandbox: { title_ } &ndash; { cpReporting.getNewsroomName( this.props.mkt ) }</div>
						<ButtonToExcel />
					</div>
					<ReportBox data={ this.state.data } />
				</div>
			</div>
		);
	}
} );

var CheckboxOffline = React.createClass( {
	getInitialState: function() {
		//console.log( cpReporting.getCookie( 'offline' ) );
		return {
			offline_mode: ( 'true' === cpReporting.getCookie( 'offline' ) ? true : false ),
		};
	},
	handleClick: function() {
		this.setState( { offline_mode: ! this.state.offline_mode } );
		cpReporting.setCookie( 'offline', ( ! this.state.offline_mode ), 365 );
	},
	render: function() {
		return (
			<input type="checkbox" id="pn_cp_offline_mode" onClick={ this.handleClick } checked={ this.state.offline_mode } />
		);
	}
} );

/*** set up page once loaded ***/
jQuery( document ).ready( function() {
	cpReporting.onChange();
} );
