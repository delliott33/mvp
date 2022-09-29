import React, {useState} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline, Circle } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Dimensions, Button, Modal, Pressable } from 'react-native';
import {getPreciseDistance} from 'geolib';

export default function App() {

const circleInfoArray = [
  {yards: 100, yardage: 91.44, color: 'rgba(255,0,0, 1)'},
  {yards: 150, yardage: 137.16, color: 'rgba(255,255,255, 1)'},
  {yards: 200, yardage: 182.88, color: 'rgba(0,0,255, 1)'},
  {yards: 250, yardage: 228.6, color: 'rgba(255,255,0, 1)'},
  {yards: 300, yardage: 228.6, color: 'rgba(0,0,0, 1)'}
];
const beginningMapHeight = .8;
const noteInputHeight = .4;

const[latitude, setLatitude] = useState(30.289976);
const[longitude, setLongitude] = useState(-97.777029);
const[delta, setDelta] = useState(.0055);
const { height, width } = Dimensions.get( 'window' );
const longitudeDelta = delta * (width / height);

const[circleShow, setCircleShow] = useState(false);
const[markerArray, setMarkerArray] = useState([]);
const[previousClickLoc, setPreviousClickLoc] = useState({coord: []});
const[noteText, setNoteText] = useState([]);
const[noteShow, setNoteShow] = useState(false);
const[showAllNotes, setShowAllNotes] = useState(false);
const[tempNoteText, setTempNoteText] = useState('');

const [allNotesModalVisible, setAllNotesModalVisible] = useState(false);
const [inputModalVisible, setInputModalVisible] = useState(false);

const[mapHeight, setMapHeight] = useState(beginningMapHeight);

const numNotes = 0;

const calcDistance = (gps1, gps2) => {
  const temp1 = {
    latitude: gps1[0],
    longitude: gps1[1]
  }
  const temp2 = {
    latitude: gps2[0],
    longitude: gps2[1]
  }
  return getPreciseDistance(temp1, temp2)
};

const addMarker = (e) => {
  if(typeof e.persist === "function"){
    e.persist();
  }
  const clickLoc = {coord: [e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]};
  if(markerArray.length < 1) {
    setPreviousClickLoc(clickLoc);
    setMarkerArray(oldArray => [...oldArray, {
      name: markerArray.length+1,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude
    }]);
  } else {
    setMarkerArray(oldArray => [...oldArray, {
      name: markerArray.length+1,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      previousClick: previousClickLoc.coord,
      distance: calcDistance(previousClickLoc.coord, clickLoc.coord)
    }]);
    //resetting the state of the previous click to current click for the next Marker Add iteration
    setPreviousClickLoc({coord: previousClickLoc.coord.filter(location => {
      return location !== clickLoc.coord;})});
    setPreviousClickLoc(clickLoc);
  }
}

const deleteAllMarkers = (e) => {
  setPreviousClickLoc({coord: previousClickLoc.coord.filter(location => {
    return location !== e;})});
  setPreviousClickLoc({coord: []});
  setMarkerArray(markerArray.filter(marker => {
    return marker !== e;}));
  setMarkerArray([]);
}

const handleAllCircles = (e) => {
  setCircleShow(!circleShow);
}

const handleNoteInput = (e) => {
  setNoteShow(!noteShow);
}

const handleNoteSubmit = (e) => {
  setInputModalVisible(!inputModalVisible);
}

const handleAllNotesClose = (e) => {
  setShowAllNotes(!showAllNotes);
}

const handleNoteText = (text) => {
  setTempNoteText('')
  setTempNoteText(text);
};

const handleShowAllNotes = (e) => {
  setShowAllNotes(!showAllNotes);
}

const clearAllNotes = () => {
  setNoteText(noteText.filter(note => {
    return note !== 78373938;}));
    setNoteText([]);
}

const handleCurrentPositionStart = (e) => {
  addMarker({
    nativeEvent: {
      coordinate: {
        latitude: latitude,
        longitude: longitude
      }
    }
  });
}

  return (
    <View>
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        style={{width: Dimensions.get('window').width,
          height: Dimensions.get('window').height*mapHeight
        }}
        onPress={(e) => {addMarker(e);}}
        showsCompass={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: delta,
          longitudeDelta: longitudeDelta
        }}

        >

        {circleShow ? circleInfoArray.map((circleInfo) => {
          return <Circle
          center={{latitude: 30.289976, longitude: -97.777029}}
          radius={circleInfo.yards}
          style={styles.circle}
          strokeColor={circleInfo.color}
          strokeWidth={3}
          >
            {/* <Text>{circleInfo.yards}</Text> */}
          </Circle>
        })
        : null
        }

        {markerArray.map((marker, index) => {
          if(index === 0){
            return <Marker draggable coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
            //add delete onPress function
            >
              <Text style={styles.text}>Start</Text>
            </Marker>
          } else {
            return <Marker draggable coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
            >
              <Text style={styles.text}>{marker.distance}</Text>
            </Marker>
          }
        })}

        <Polyline coordinates={
          markerArray.map((marker) => {
            var obj = {latitude: marker.latitude, longitude: marker.longitude};
            return obj
          })
        }
        ></Polyline>

      </MapView>
      <Text style={styles.directions}>
        Tap map to determine starting point, then click anywhere on map
      </Text>

      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={inputModalVisible}
          onRequestClose={() => {
            setInputModalVisible(!inputModalVisible);
            // handleNoteText(text);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <TextInput
                editable={true}
                multiline={true}
                scrollEnabled={true}
                maxLength={100}
                style={styles.modalText}
                onChangeText={handleNoteText}
                value={noteText}
                placeholder="Enter note here">

              </TextInput>
                <Button title="Submit Note" onPress={(e) => {
                  setNoteText(oldNotesArray => [...oldNotesArray,
                    {name: `Note ${noteText.length+1}`,
                     text: tempNoteText
                    }]
                   );
                  // setInputModalVisible(!inputModalVisible);
                  handleNoteSubmit(e);
                }}></Button>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={allNotesModalVisible}
          onRequestClose={() => {
            setAllNotesModalVisible(!allNotesModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              {noteText.map((note, index) => {
                return <Text style={styles.notetext}> {`${note.name}: ${note.text}`}</Text>

                // if(noteText.length === 0){
                //   return <Text style={styles.notetext}> {`You don't have any notes! Click on Take Notes to add some`}></Text>
                // } else {
                //   return <Text style={styles.notetext}> {`${note.name}: ${note.text}`}</Text>
                // }

              })}

              <Button title="Close Notes" style={[styles.button, styles.buttonClose]} onPress={(e) => {
                setAllNotesModalVisible(!allNotesModalVisible)
              }}></Button>
              <Button title="Clear All Notes" style={[styles.button, styles.buttonClose]} onPress={(e) => {
                clearAllNotes();
              }}></Button>

            </View>
          </View>
        </Modal>
      </>
      <Button title="Start From Current Position" onPress={(e) => {handleCurrentPositionStart(e);}} ></Button>
      <Button title="Show/Hide Circles" onPress={(e) => {handleAllCircles(e);}}
      ></Button>
      <Button title="Reset Shots" onPress={(e) => {deleteAllMarkers(e);}}
      ></Button>
      <Button title="Take Notes" onPress={(e) => {
        setInputModalVisible(true);
        }}>

      </Button>
      <Button title="Show Previous Notes" onPress={(e) => {
        setAllNotesModalVisible(true);
        }}>
      </Button>
      {/* <Button title="Show Wind"></Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notetext: {
    fontSize: 12,
  },
  text: {
    fontSize: 20,
  },
  directions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 140,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }

});
