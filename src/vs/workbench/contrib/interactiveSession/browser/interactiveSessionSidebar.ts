/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { editorBackground } from 'vs/platform/theme/common/colorRegistry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IViewPaneOptions, ViewPane } from 'vs/workbench/browser/parts/views/viewPane';
import { IViewDescriptorService } from 'vs/workbench/common/views';
import { InteractiveSessionWidget } from 'vs/workbench/contrib/interactiveSession/browser/interactiveSessionWidget';

export interface IInteractiveSessionViewOptions {
	readonly providerId: string;
}

export const INTERACTIVE_SIDEBAR_PANEL_ID = 'workbench.panel.interactiveSessionSidebar';
export class InteractiveSessionViewPane extends ViewPane {
	static instances: InteractiveSessionViewPane[] = [];
	static ID = 'workbench.panel.interactiveSession.view';

	private view: InteractiveSessionWidget;

	constructor(
		interactivSessionViewOptions: IInteractiveSessionViewOptions,
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, telemetryService);
		// TODO hacks
		InteractiveSessionViewPane.instances.push(this);
		this.view = this._register(this.instantiationService.createInstance(InteractiveSessionWidget, interactivSessionViewOptions.providerId, this.id, () => this.getBackgroundColor(), () => this.getBackgroundColor(), () => editorBackground));

		this._register(this.onDidChangeBodyVisibility(visible => {
			this.view.setVisible(visible);
		}));
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);
		this.view.render(parent);
	}

	acceptInput(): void {
		this.view.acceptInput();
	}

	clear(): void {
		this.view.clear();
	}

	focusInput(): void {
		this.view.focusInput();
	}

	override focus(): void {
		super.focus();
		this.view.focusInput();
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.view.layout(height, width);
	}
}


