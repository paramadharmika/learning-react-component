/** @jsx React.DOM */ 
var IScroll4Container = React.createClass({
	myScroll: {},
	scroll_in_progress: false,
	getInitialState: function() {
		return { 
			pullState: 'pull-down-to-refresh',
			isOnePage: false,
		};
	},
	getDefaultProps: function() {
		return {
			items: [],
			user: {},

			// event handlers props
			onPullDown: function() {

			}, 
			onPullUp: function() {

			}
		};
	},
	componentDidMount: function() {
		var self = this;

		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var marginFromTopToShowReleaseState = 59;
		var offset = marginFromTopToShowReleaseState;
		var isOnePage = false;

		var iScrollOptions = {
			snap: false,
            momentum: true,
            hScrollbar: false,
			useTransition: true,
			bindToWrapper: true,
			topOffset: offset,
			hideScrollbar: false,
			fadeScrollbar: false,
			onRefresh: function () {
				isOnePage = $('#scroller').height() <= (viewportHeight - (2*marginFromTopToShowReleaseState));
				// console.info('ISCROLL-ON-REFRESH: ' + this.y + ', isOnePage:' + isOnePage);
				self.refs.pullUpControl.setExcededViewport(!isOnePage);
			},
			onScrollStart: function() {

			},
			onScrollMove: function () {
				self.scroll_in_progress = true;

				if ((this.y < 5 && this.y > -marginFromTopToShowReleaseState) && self.refs.pullDownControl.isOnIdleState()) {
					self.refs.pullDownControl.showPullDownControl();
				} else if (this.y >= 5 && self.refs.pullDownControl.isOnPullDownState()) { 
					self.refs.pullDownControl.showPullDownReleaseToRefreshControl();
					this.minScrollY = 0;
					// console.info('-----ISCROLL-IN-PROGRESS-FLIP: ' +  this.y);
				} else if (this.y < 5 && self.refs.pullDownControl.isOnReleaseToRefreshState()) { 
					self.refs.pullDownControl.showPullDownControl();
					this.minScrollY = -marginFromTopToShowReleaseState;
					// console.info('-----ISCROLL-IN-PROGRESS-RELEASE-TO-REFRESH: ' +  this.y);
				} else if (this.y > (this.maxScrollY + 5)) {
					// console.info('-----ISCROLL-ENTERING-INFINITE-SCROLL: ' +  this.y);
				}

				// console.info('-----ISCROLL-IN-PROGRESS: ' +  this.y);
			},
			onScrollEnd: function () {
				console.info('---ISCROLL-ENDED: ' + this.y);

				self.scroll_in_progress = false;

				//simulate async call
				if (self.refs.pullDownControl.isOnReleaseToRefreshState() ) {
					self.refs.pullDownControl.showPullDownLoadingControl();

					self.props.onPullDown().then(function(success) {
						// console.info('---ISCROLL-ENDED-SCROLL-TO-FIRST-ELEMENT: ' + self.myScroll.y);
						setTimeout(function() {
							self.myScroll.refresh();
							self.refs.pullDownControl.showIdleControl();
						}, 100);
						
						// 	// TODO: probably dont scroll to first element let the user stay at where they were right now, 
						// 	// TODO: added variable here> to say "i'm just finish with pull to refresh so dont get me infinite scroll"
					}, function (error) {
						// TODO: show error, broadcast event
					});
				} 

				if (self.refs.pullUpControl.isExcededViewportState()) {
					//detect scrolling to end of list and see if this page are still on one page
					if (this.y == this.maxScrollY) {
						//prohibit user to do infinite scroll again, if its already in progress
						if (self.refs.pullUpControl.isOnLoadingState()) {
							return;
						}

						// console.info('ISCROLL-INFINITE-SCROLL');
						self.refs.pullUpControl.showInfiniteLoadingControl();

						//simulate ajax call for infinite scroll
						self.props.onPullUp().then(function(success) {
							setTimeout(function () {
								self.refs.pullUpControl.showIdleControl();
								self.refs.pullDownControl.showIdleControl();

								self.myScroll.refresh();
							}, 100);
						}, function (error) {
							// TODO: show error, broadcast event
						});
					}
				}
				
				// console.info('ISCROLL-MAX-SCROLL-Y : ' + this.maxScrollY);
				// console.info('ISCROLL-VIEWPORT-HEIGHT : ' + viewportHeight);
			}
		};

		this.myScroll = new iScroll(this.getDOMNode(), iScrollOptions);
		// console.info('ISCROLL-COMPONENT-DID-MOUNT');

		// In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - 
		// the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
		setTimeout(function() {
			$('#wrapper').css({ left:0 });
		}, 100);
	},
	componentWillUnmount: function() {
		// document.removeEventListener('touchstart');
		// document.removeEventListener('touchend');
	},
	render: function() {
		console.info('ISCROLL-RENDER:');

		/*if (this.props.items.length) {

		}*/

		return (
			<div id="wrapper" className="center-container">
				<div id="scroller">
					<IScrollPullDown ref="pullDownControl" />
					<ScrollContent items={this.props.items} user={this.props.user} />
					<IScrollPullUp ref="pullUpControl" />
				</div>
			</div>
		);
	} 
});
