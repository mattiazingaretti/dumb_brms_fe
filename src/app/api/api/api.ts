export * from './authController.service';
import { AuthControllerService } from './authController.service';
export * from './dummyBrmsController.service';
import { DummyBrmsControllerService } from './dummyBrmsController.service';
export * from './projectController.service';
import { ProjectControllerService } from './projectController.service';
export const APIS = [AuthControllerService, DummyBrmsControllerService, ProjectControllerService];
