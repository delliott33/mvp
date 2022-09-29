// import React, {Component} from 'react';
// import {View, StyleSheet,TouchableOpacity, Dimensions, Image, Text} from 'react-native';
// import MapView from 'react-native-maps';
// // import Images from '../../config/Images';

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// class Mapper extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       focusedLocation: {
//         latitude: 36.14319077106534,
//         longitude: -86.76708101838142,
//         latitudeDelta: 0.00522,
//         longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.00522
//       }
//     };
//   }
//   onPressZoomIn() {
//     this.region = {
//       latitude: this.state.focusedLocation.latitude,
//       longitude: this.state.focusedLocation.longitude,
//       latitudeDelta: this.state.focusedLocation.latitudeDelta * 10,
//       longitudeDelta: this.state.focusedLocation.longitudeDelta * 10
//     }

//     this.setState({
//       focusedLocation: {
//         latitudeDelta: this.region.latitudeDelta,
//         longitudeDelta: this.region.longitudeDelta,
//         latitude: this.region.latitude,
//         longitude: this.region.longitude
//       }
//     })
//     this.map.animateToRegion(this.region, 100);
//   }

//   onPressZoomOut() {
//     this.region = {
//       latitude: this.state.focusedLocation.latitude,
//       longitude: this.state.focusedLocation.longitude,
//       latitudeDelta: this.state.focusedLocation.latitudeDelta / 10,
//       longitudeDelta: this.state.focusedLocation.longitudeDelta / 10
//     }
//     this.setState({
//       focusedLocation: {
//         latitudeDelta: this.region.latitudeDelta,
//         longitudeDelta: this.region.longitudeDelta,
//         latitude: this.region.latitude,
//         longitude: this.region.longitude
//       }
//     })
//     this.map.animateToRegion(this.region, 100);
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <MapView
//           region={this.state.focusedLocation}
//           style={styles.map}
//           mapType={"hybrid"}
//           onPress={this.pickLocationHandler}
//           showsUserLocation={true}
//           followUserLocation={true}
//           zoomEnabled={true}
//           customMapStyle={mapStyle}
//           ref={ref => this.map = ref}
//         >
//           {this.state.markers.map((marker, index) => (
//             <MapView.Marker
//               pinColor={'yellow'}
//               onPress={e => console.log(e.nativeEvent)}
//               key={index}
//               coordinate={marker.coordinates}
//               title={marker.title}
//             />
//           ))}
//         </MapView>
//         <TouchableOpacity
//           style={styles.zoomIn}
//           onPress={() => { this.onPressZoomIn() }}
//         >
//           <Icon
//             name="add"
//             style={styles.icon}
//             size={20}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.zoomOut}
//           onPress={() => { this.onPressZoomOut() }}
//         >
//           <Icon
//             name="remove"
//             style={styles.icon}
//             size={20}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }