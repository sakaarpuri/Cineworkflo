import { AI_NATIVE_MOVES_META, CLASSIC_MOVES_META, DYNAMIC_MOVES_META, HOMEPAGE_CAMERA_MOVE_IDS } from '../../lib/cameraMovesMeta'
import {
  CraneMove,
  DollyMove,
  DollyZoomMove,
  DroneMove,
  DutchAngleMove,
  HandheldMove,
  OrbitMove,
  PanMove,
  PushThroughMove,
  SteadicamMove,
  TiltMove,
  TrackingMove,
  WhipPanMove,
  ZoomMove,
} from './moves'

const MOVE_COMPONENTS = {
  dolly: DollyMove,
  pan: PanMove,
  tilt: TiltMove,
  zoom: ZoomMove,
  tracking: TrackingMove,
  crane: CraneMove,
  handheld: HandheldMove,
  steadicam: SteadicamMove,
  'whip-pan': WhipPanMove,
  dutch: DutchAngleMove,
  orbit: OrbitMove,
  drone: DroneMove,
  'dolly-zoom': DollyZoomMove,
  'push-through': PushThroughMove,
}

const withComponents = (moves) => moves.map((move) => ({ ...move, MoveComponent: MOVE_COMPONENTS[move.id] }))

export const CLASSIC_MOVES = withComponents(CLASSIC_MOVES_META)
export const DYNAMIC_MOVES = withComponents(DYNAMIC_MOVES_META)
export const AI_NATIVE_MOVES = withComponents(AI_NATIVE_MOVES_META)

const ALL_CAMERA_MOVES = [...CLASSIC_MOVES, ...DYNAMIC_MOVES, ...AI_NATIVE_MOVES]
export const HOMEPAGE_CAMERA_MOVES = HOMEPAGE_CAMERA_MOVE_IDS.map((id) => ALL_CAMERA_MOVES.find((move) => move.id === id)).filter(Boolean)
