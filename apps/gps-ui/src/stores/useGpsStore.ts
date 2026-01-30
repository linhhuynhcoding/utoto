import { create } from "zustand";
import { GpsPoint, Route } from "@utoto/shared";

interface GpsState {
  routes: Record<string, Route>;
  points: Record<string, GpsPoint>; // Current positions
  cars: Record<string, any>; // Car metadata
  selectedCar: string | null;
  movements: Record<string, boolean>; // True if car is moving
  setRoute: (licenseNumber: string, points: GpsPoint[]) => void;
  // addPoint: (point: GpsPoint) => void;
  addCar: (car: any) => void;
  setSelectedCar: (licenseNumber: string | null) => void;
  clearRoutes: () => void;
  toggleMovement: (licenseNumber: string) => void;
  moveToNextTarget: (licenseNumber: string) => void;
  movePosition: (licenseNumber: string) => void;
}

export const useGpsStore = create<GpsState>((set) => ({
  routes: {},
  points: {},
  cars: {},
  selectedCar: null,
  movements: {},

  setRoute: (licenseNumber, points) =>
    set((state) => {
      const res = {
        routes: {
          ...state.routes,
          [licenseNumber]: {
            licenseNumber: licenseNumber,
            points: points,
            cur_pos: points[0],
            next_target: 1,
          },
        },
        movements: {
          ...state.movements,
          [licenseNumber]: false,
        },
        points: {
          ...state.points,
          [licenseNumber]: points[0],
        },
      };
      console.log(`New routes: `, { res });
      return res;
    }),

  // addPoint: (point) =>
  //   set((state) => {
  //     const licenseNumber = point.licenseNumber;
  //     const currentRoute = state.routes[licenseNumber] || [];
  //     const newRoute = [...currentRoute.slice(-999), point];

  //     return {
  //       routes: {
  //         ...state.routes,
  //         [licenseNumber]: newRoute,
  //       },
  //       points: {
  //         ...state.points,
  //         [licenseNumber]: point,
  //       },
  //     };
  //   }),

  addCar: (car) =>
    set((state) => ({
      cars: {
        ...state.cars,
        [car.license_number]: car,
      },
    })),

  setSelectedCar: (licenseNumber) => set({ selectedCar: licenseNumber }),

  clearRoutes: () =>
    set({ routes: {}, points: {}, cars: {}, selectedCar: null, movements: {} }),

  toggleMovement: (licenseNumber) =>
    set((state) => ({
      movements: {
        ...state.movements,
        [licenseNumber]: !state.movements[licenseNumber],
      },
    })),

  moveToNextTarget: (licenseNumber) =>
    set((state) => {
      const route = state.routes[licenseNumber];
      if (!route || route.points.length === 0) return state;

      const nextPos = route.next_target + 1;
      if (nextPos >= route.points.length) return state;
      return {
        routes: {
          ...state.routes,
          [licenseNumber]: {
            ...route,
            next_target: nextPos,
          },
        },
        points: {
          ...state.points,
          [licenseNumber]: route.points[nextPos],
        },
      };
    }),

  movePosition: (licenseNumber) =>
    set((state) => {
      const route = state.routes[licenseNumber];
      if (!route || route.points.length === 0) return state;
      if (!state.movements[licenseNumber]) return state;
      if (route.next_target >= route.points.length) {
        return {
          ...state,
          movements: {
            ...state.movements,
            [licenseNumber]: false,
          },
        };
      }

      const target_point = route.points[route.next_target];
      console.log("target point: ", target_point);

      if (
        Math.abs(route.cur_pos[0] - target_point[0]) < 0.001 &&
        Math.abs(route.cur_pos[1] - target_point[1]) < 0.001
      ) {
        return {
          routes: {
            ...state.routes,
            [licenseNumber]: {
              ...route,
              next_target: route.next_target + 1,
              cur_pos: target_point,
            },
          },
          points: {
            ...state.points,
            [licenseNumber]: target_point,
          },
        };
      }

      const previous_point = route.points[route.next_target - 1];
      const step = (target_point[0] - previous_point[0]) / 100;
      let next_pos = calcNextPosition(route.cur_pos, target_point, step);

      return {
        routes: {
          ...state.routes,
          [licenseNumber]: {
            ...route,
            cur_pos: next_pos,
          },
        },
        points: {
          ...state.points,
          [licenseNumber]: next_pos,
        },
      };
    }),
}));

// y = ax + b
function calcLinearEquation(
  p1: GpsPoint,
  p2: GpsPoint,
): { a: number; b: number } {
  let [x1, y1] = p1;
  let [x2, y2] = p2;
  let a = (y2 - y1) / (x2 - x1);
  let b = y1 - a * x1;
  return { a, b };
}

function calcNextPosition(p1: GpsPoint, p2: GpsPoint, step: number): GpsPoint {
  const { a, b } = calcLinearEquation(p1, p2);
  let [x1, y1] = p1;
  let [x2, y2] = p2;
  let next_x = x1 + step;
  let next_y = a * next_x + b;
  return [next_x, next_y];
}
