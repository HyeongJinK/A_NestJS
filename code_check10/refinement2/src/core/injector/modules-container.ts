import { uid } from 'uid';
import { Module } from './module';

export class ModulesContainer extends Map<string, Module> {
  private readonly _applicationId = uid(21);

  get applicationId(): string {
    return this._applicationId;
  }
}
