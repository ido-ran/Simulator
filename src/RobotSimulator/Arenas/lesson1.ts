import {
  ArenaConfig,
  ChallengeConfig,
  ChallengeListener,
  ChallengeActions,
  ChallengeEvent,
} from "./base";
import { MessageType } from "../../state/messagesSlice";
import { CoreSimTypes } from "@fruk/simulator-core";
import { CoreSpecs } from "@fruk/simulator-core";
import { ChallengeStatus } from "./challengeSlice";
import { ArenaColourConstants } from "../../JavascriptVM/colourSensorConstants";

export const arenas = [arena];
export const challenges = [challengeA, challengeB, challengeC];

function arena(): ArenaConfig {
  const arenaConfig: ArenaConfig = {
    name: "Lesson 1 - Motors",
    worldConfig: {
      zLength: 5,
      xLength: 5,
      walls: [],
      perimeter: {
        height: 0.5,
        thickness: 0.1,
      },
      camera: {
        position: {
          x: 0,
          y: 3,
          z: 3,
        },
      },
    },
  };

  return arenaConfig;
}

function challengeA(): ChallengeConfig {
  const badZones: CoreSpecs.IZoneSpec[] = [
    {
      type: "zone",
      initialPosition: { x: -1.2, y: 0 },
      zoneShape: {
        type: "rectangle",
        xLength: 0.5,
        zLength: 5,
      },
      baseColor: 0x000000,
      zoneId: "0",
    },
    {
      type: "zone",
      initialPosition: { x: 1.2, y: 0 },
      zoneShape: {
        type: "rectangle",
        xLength: 0.5,
        zLength: 5,
      },
      baseColor: 0x000000,
      zoneId: "1",
    },
  ];
  const challengeConfig: ChallengeConfig = {
    name: "Lesson 1 - Challenge A",
    startPosition: { x: 0, y: 2 },
    arenaConfig: arena(),
    eventListener: new Lesson1Challenge({ x: 0, y: -2 }, badZones),
    descriptions: {
      short: "Using the motors",
      markdown: `
# Lesson 1 - Challenge A

The robot needs to avoid the black areas of the playfield and end up in the green zone
at the far side of the arena.

If at any point the robot comes into contact with the black area then the robot must
start again.
      `,
    },
  };

  return challengeConfig;
}

function challengeB(): ChallengeConfig {
  const badZones: CoreSpecs.IZoneSpec[] = [
    {
      type: "zone",
      initialPosition: { x: 0, y: 1 },
      zoneShape: {
        type: "rectangle",
        xLength: 1,
        zLength: 3,
      },
      baseColor: 0x000000,
      zoneId: "0",
    },
  ];
  const challengeConfig: ChallengeConfig = {
    name: "Lesson 1 - Challenge B",
    startPosition: { x: -2, y: 2 },
    arenaConfig: arena(),
    eventListener: new Lesson1Challenge({ x: +2, y: 2 }, badZones),
    descriptions: {
      short: "Using the motors to turn a corner",
      markdown: `
# Lesson 1 - Challenge B

The robot needs to avoid the black areas of the playfield and end up in the green zone
at the far side of the arena.

This time the route isn't going to be a straight one.

If at any point the robot comes into conact with the black area then the robot must
start again.
      `,
    },
  };

  return challengeConfig;
}

function challengeC(): ChallengeConfig {
  const badZones: CoreSpecs.IZoneSpec[] = [
    {
      type: "zone",
      initialPosition: { x: -1.4, y: 0.5 },
      zoneShape: {
        type: "rectangle",
        xLength: 0.2,
        zLength: 4,
      },
      baseColor: 0x000000,
      zoneId: "0",
    },
    {
      type: "zone",
      initialPosition: { x: 1.4, y: 0.5 },
      zoneShape: {
        type: "rectangle",
        xLength: 0.2,
        zLength: 4,
      },
      baseColor: 0x000000,
      zoneId: "1",
    },
    {
      type: "zone",
      initialPosition: { x: 0, y: -0.5 },
      zoneShape: {
        type: "rectangle",
        xLength: 0.4,
        zLength: 4,
      },
      baseColor: 0x000000,
      zoneId: "2",
    },
  ];
  const challengeConfig: ChallengeConfig = {
    name: "Lesson 1 - Challenge C",
    startPosition: { x: -2, y: 2 },
    arenaConfig: arena(),
    eventListener: new Lesson1Challenge({ x: 2, y: 2 }, badZones),
    descriptions: {
      short: "Using the motors to turn precise angles",
      markdown: `
# Lesson 1 - Challenge C

The robot needs to avoid the black areas of the playfield and end up in the green zone
at the far side of the arena.

This time the route isn't going to be a straight one.

If at any point the robot comes into conact with the black area then the robot must
start again.
      `,
    },
  };

  return challengeConfig;
}

const FinishZoneId = "finish-zone";

class Lesson1Challenge implements ChallengeListener {
  private challengeOutcomePending: boolean;
  constructor(
    public finishPosition: CoreSimTypes.Vector2d,
    public badZones: CoreSpecs.IZoneSpec[]
  ) {
    this.challengeOutcomePending = true;
  }
  actions?: ChallengeActions;

  onStart(actions: ChallengeActions) {
    this.actions = actions;
    actions.addObject({
      type: "zone",
      initialPosition: this.finishPosition,
      zoneId: FinishZoneId,
      zoneShape: {
        type: "rectangle",
        zLength: 1,
        xLength: 1,
      },
      baseColor: ArenaColourConstants.GREEN,
    });
    this.badZones.forEach((z) => {
      z.zoneId = "bad-" + z.zoneId;
      actions.addObject(z);
    });
    this.challengeOutcomePending = true;
  }

  onStop() {
    this.actions = undefined;
  }

  onEvent(e: ChallengeEvent) {
    if (e.kind === "ZoneEvent") {
      if (e.zoneId === FinishZoneId && this.challengeOutcomePending === true) {
        this.challengeOutcomePending = false;
        this.actions?.displayFadingMessage("Robot Wins!", MessageType.success);
        this.actions?.setChallengeStatus(ChallengeStatus.Success);
      } else if (
        e.zoneId.startsWith("bad-") &&
        this.challengeOutcomePending === true
      ) {
        this.challengeOutcomePending = false;
        this.actions?.displayFadingMessage("Robot Looses!", MessageType.danger);
        this.actions?.setChallengeStatus(ChallengeStatus.Failure);
      }
    }
  }
}
