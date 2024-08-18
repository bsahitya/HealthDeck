// App.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { permissions } from "./healthService";
import AppleHealthKit, {
  BloodPressureSampleValue,
  ElectrocardiogramSampleValue,
  HealthDateOfBirth,
  HealthValue,
  HKWorkoutQueriedSampleType,
} from "react-native-health";
import Card from "./Card";

interface HealthData {
  activity: {
    activeEnergyBurned: HealthValue[];
    basalEnergyBurned: HealthValue[];
    appleStandTime: HealthValue[];
  };
  body: {
    height: HealthValue[];
    weight: HealthValue[];
    bodyTemperature: HealthValue[];
    bodyFatPercentage: HealthValue[];
    leanBodyMass: HealthValue[];
  };
  characteristic: {
    biologicalSex: HealthValue | null;
    dateOfBirth: HealthDateOfBirth | null;
  };
  dietary: {
    energyConsumed: HealthValue[];
    protein: HealthValue[];
    fiber: HealthValue[];
    totalFat: HealthValue[];
    water: HealthValue | null;
  };
  fitness: {
    distanceWalkingRunning: HealthValue | null;
    distanceSwimming: HealthValue | null;
    distanceCycling: HealthValue | null;
    flightsClimbed: HealthValue | null;
  };
  hearing: {
    environmentalAudioExposure: HealthValue[];
    headphoneAudioExposure: HealthValue[];
  };
  labTests: {
    bloodAlcoholContent: HealthValue[];
    bloodGlucose: HealthValue[];
  };
  nutrition: {
    carbohydrates: HealthValue[];
  };
  mindfulness: {
    mindfulSession: HealthValue[];
  };
  sleep: {
    sleepAnalysis: HealthValue[];
  };
  vitals: {
    bloodPressure: BloodPressureSampleValue[];
    electrocardiogram: ElectrocardiogramSampleValue[];
    heartRate: HealthValue[];
    oxygenSaturation: HealthValue[];
    respiratoryRate: HealthValue[];
    bmi: HealthValue[];
  };
  workout: {
    workout: HKWorkoutQueriedSampleType[];
  };
}

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const camelCaseToTitleCase = (str: string) => {
  // Split the string based on uppercase letters and join with a space
  const result = str.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter of each word and convert the rest to lowercase
  return result
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const renderSamples = (
  samples:
    | HealthValue
    | HealthValue[]
    | HKWorkoutQueriedSampleType[]
    | null
    | undefined
) => {
  if (Array.isArray(samples)) {
    if (samples.length === 0) {
      return <Text>No data found for this user</Text>;
    }

    return samples.map((sample, index) => {
      if ("activityName" in sample) {
        // Handling HKWorkoutQueriedSampleType
        return (
          <View key={index} style={{ marginBottom: 8 }}>
            <Text>Activity Name: {sample.activityName}</Text>
            <Text>Calories: {sample.calories} kcal</Text>
            <Text>Distance: {sample.distance} meters</Text>
            <Text>Duration: {sample.duration} seconds</Text>
            <Text>Device: {sample.device}</Text>
            <Text>Tracked: {sample.tracked ? "Yes" : "No"}</Text>
            <Text>Source: {sample.sourceName}</Text>
            <Text>Start: {sample.start}</Text>
            <Text>End: {sample.end}</Text>
            {/* Add any additional fields you want to display here */}
          </View>
        );
      } else {
        // Handling HealthValue
        return <Text key={index}>{sample.value}</Text>;
      }
    });
  } else if (samples && typeof samples === "object") {
    return <Text>{samples.value}</Text>;
  } else {
    return <Text>No data found</Text>;
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<HealthData>({
    activity: {
      activeEnergyBurned: [],
      basalEnergyBurned: [],
      appleStandTime: [],
    },
    body: {
      height: [],
      weight: [],
      bodyTemperature: [],
      bodyFatPercentage: [],
      leanBodyMass: [],
    },
    characteristic: { biologicalSex: null, dateOfBirth: null },
    dietary: {
      energyConsumed: [],
      protein: [],
      fiber: [],
      totalFat: [],
      water: null,
    },
    fitness: {
      distanceWalkingRunning: null,
      distanceSwimming: null,
      distanceCycling: null,
      flightsClimbed: null,
    },
    hearing: { environmentalAudioExposure: [], headphoneAudioExposure: [] },
    labTests: { bloodAlcoholContent: [], bloodGlucose: [] },
    nutrition: { carbohydrates: [] },
    mindfulness: { mindfulSession: [] },
    sleep: { sleepAnalysis: [] },
    vitals: {
      bloodPressure: [],
      electrocardiogram: [],
      heartRate: [],
      oxygenSaturation: [],
      respiratoryRate: [],
      bmi: [],
    },
    workout: { workout: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve, reject) => {
          AppleHealthKit.initHealthKit(permissions, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("");
            }
          });
        });

        const weeklyOptions = {
          startDate: new Date(2024, 8, 7).toISOString(), // required
          endDate: new Date().toISOString(), // optional; default now
          ascending: true, // optional
          includeManuallyAdded: true, // optional
        };

        // Fetch data for each category
        const activityData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getActiveEnergyBurned(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in activity";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const basalEnergyData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBasalEnergyBurned(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in basal energy";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const standTimeData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getAppleStandTime(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in stand time";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );

        const heightData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getHeightSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in height";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );
        const weightData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getWeightSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in weight";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );

        const bodyTempData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBodyTemperatureSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in body temp";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const bodyFatData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBodyFatPercentageSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in body fat";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const leanBodyMassData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getLeanBodyMassSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in body mass";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );

        const biologicalSexData: HealthValue = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBiologicalSex({}, (error, result) => {
              if (error) {
                error.message += " in sex";
                reject(error);
              } else {
                resolve(result ?? null);
              }
            });
          }
        );
        const dobData: HealthDateOfBirth = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getDateOfBirth(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in dob";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );

        const energyConsumedData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getEnergyConsumedSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in energy consumed";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const proteinData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getProteinSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in protein";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );
        const fiberData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getFiberSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in fiber";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );
        const totalFatData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getTotalFatSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in total fat";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const waterData: HealthValue = await new Promise((resolve, reject) => {
          AppleHealthKit.getWater(weeklyOptions, (error, result) => {
            if (error) {
              error.message += " in water";
              reject(error);
            } else {
              resolve(result ?? null);
            }
          });
        });

        const distanceWalkingRunningData: HealthValue = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getDistanceWalkingRunning(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in walking";
                  reject(error);
                } else {
                  resolve(result ?? null);
                }
              }
            );
          }
        );
        const distanceSwimmingData: HealthValue = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getDistanceSwimming(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in swimming";
                  reject(error);
                } else {
                  resolve(result ?? null);
                }
              }
            );
          }
        );
        const distanceCyclingData: HealthValue = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getDistanceCycling(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in distanceCyclingData";
                  reject(error);
                } else {
                  resolve(result ?? null);
                }
              }
            );
          }
        );
        const flightsClimbedData: HealthValue = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getFlightsClimbed(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in flighst climbed";
                reject(error);
              } else {
                resolve(result ?? null);
              }
            });
          }
        );

        const environmentalAudioExposureData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getEnvironmentalAudioExposure(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in environmentalAudioExposureData";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const headphoneAudioExposureData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getHeadphoneAudioExposure(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in headphoneAudioExposureData";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );

        const bloodAlcoholContentData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBloodAlcoholContentSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in bloodAlcoholContentData";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const bloodGlucoseData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getBloodGlucoseSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in bloodGlucoseData";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );

        const carbohydratesData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getCarbohydratesSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in carbohydratesData";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          }
        );
        const mindfulSessionData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getMindfulSession(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in mindfulSessionData";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );
        const sleepAnalysisData: HealthValue[] = await new Promise(
          (resolve, reject) => {
            AppleHealthKit.getSleepSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in sleepAnalysisData";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          }
        );
        const vitalsData = {
          bloodPressure: (await new Promise((resolve, reject) => {
            AppleHealthKit.getBloodPressureSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in bloodPressure";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          })) as BloodPressureSampleValue[],
          electrocardiogram: (await new Promise((resolve, reject) => {
            AppleHealthKit.getElectrocardiogramSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in electrocardiogram";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          })) as ElectrocardiogramSampleValue[],
          heartRate: (await new Promise((resolve, reject) => {
            AppleHealthKit.getHeartRateSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in heartRate";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          })) as HealthValue[],
          oxygenSaturation: (await new Promise((resolve, reject) => {
            AppleHealthKit.getOxygenSaturationSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in oxygenSaturation";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          })) as HealthValue[],
          respiratoryRate: (await new Promise((resolve, reject) => {
            AppleHealthKit.getRespiratoryRateSamples(
              weeklyOptions,
              (error, result) => {
                if (error) {
                  error.message += " in respiratoryRate";
                  reject(error);
                } else {
                  resolve(result ?? []);
                }
              }
            );
          })) as HealthValue[],
          bmi: (await new Promise((resolve, reject) => {
            AppleHealthKit.getBmiSamples(weeklyOptions, (error, result) => {
              if (error) {
                error.message += " in bmi";
                reject(error);
              } else {
                resolve(result ?? []);
              }
            });
          })) as HealthValue[],
        };
        const workoutData = {
          workout: (await new Promise((resolve, reject) => {
            AppleHealthKit.getAnchoredWorkouts({}, (error, result) => {
              if (error) {
                error.message += " in workout";
                reject(error);
              } else {
                resolve(result?.data ?? []);
              }
            });
          })) as HKWorkoutQueriedSampleType[],
        };

        setData({
          activity: {
            activeEnergyBurned: activityData,
            basalEnergyBurned: basalEnergyData,
            appleStandTime: standTimeData,
          },
          body: {
            height: heightData,
            weight: weightData,
            bodyTemperature: bodyTempData,
            bodyFatPercentage: bodyFatData,
            leanBodyMass: leanBodyMassData,
          },
          characteristic: {
            biologicalSex: biologicalSexData,
            dateOfBirth: dobData,
          },
          dietary: {
            energyConsumed: energyConsumedData,
            protein: proteinData,
            fiber: fiberData,
            totalFat: totalFatData,
            water: waterData,
          },
          fitness: {
            distanceWalkingRunning: distanceWalkingRunningData,
            distanceSwimming: distanceSwimmingData,
            distanceCycling: distanceCyclingData,
            flightsClimbed: flightsClimbedData,
          },
          hearing: {
            environmentalAudioExposure: environmentalAudioExposureData,
            headphoneAudioExposure: headphoneAudioExposureData,
          },
          labTests: {
            bloodAlcoholContent: bloodAlcoholContentData,
            bloodGlucose: bloodGlucoseData,
          },
          nutrition: {
            carbohydrates: carbohydratesData,
          },
          mindfulness: {
            mindfulSession: mindfulSessionData,
          },
          sleep: {
            sleepAnalysis: sleepAnalysisData,
          },
          vitals: vitalsData,
          workout: workoutData,
        });
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Data</Text>
      <View style={styles.cardContainer}>
        {Object.keys(data).map((category: string) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{toTitleCase(category)}</Text>
            {Object.entries(data[category as keyof HealthData]).map(
              ([key, samples]) => (
                <Card
                  key={key}
                  title={camelCaseToTitleCase(key)}
                  containerStyle={styles.card}
                >
                  <Text>{renderSamples(samples)}</Text>
                </Card>
              )
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: "Poppins",
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    color: "#171A1F",
    textAlign: "center",
  },
  cardContainer: {
    marginVertical: 10,
  },
  categoryContainer: {
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontFamily: "Poppins" /* Heading */,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
    color: "#000000FF",
    marginBottom: 15,
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
});

export default App;
