const messages = {
	'Panel.toggle': 'Afficher le panneau Assistant RGAA',
	'PanelIframe.title': 'Panneau Assistant RGAA',
	'Header.title': 'Assistant RGAA',
	'Header.options': 'Options',
	'Header.themes': 'Référentiel',
	'Header.help': 'Aide',
	'Header.close': "Fermer l'extension",
	'Header.openPopup': 'Ouvrir dans une fenêtre',
	'ThemesList.title': 'Voir les thématiques',
	'Theme.themesMenu': 'Retourner au menu des thématiques',
	'Theme.criterion.select.label': 'Aller au critère : ',
	'Theme.criterion.select.emptyOption': 'Choisissez un critère',
	'Criterion.title': 'Critère {id}',
	'Criterion.activeTest': 'Test {id} activé',
	'Criterion.level': 'niveau {lvl}',
	'Criterion.done.label':
		'Tous les tests du critère sont faits - Cliquer pour marquer les tests comme "à faire"',
	'Criterion.todo.label':
		'Des tests restent à faire sur ce critère - Cliquer pour marquer les tests comme "fait"',
	'Criterion.toggle.show': 'Afficher les tests du critère {id}',
	'Criterion.toggle.hide': 'Cacher les tests du critère {id}',
	'Critererion.success': 'Critère(s) de succès:',
	'Wcag.abbr': 'Web content accessibility guidelines',
	'Wcag.techniques.sucess':
		'Technique(s) suffisante(s) et/ou échec(s) (en anglais):',
	'reference.tab.title': 'Réferences',
	'specialCases.note.tab.title': 'Cas particuliers',
	'technical.note.tabs.title': 'Notes techniques',
	'Test.title': 'Test {id}',
	'Test.apply.check.title': 'Activer le test {id}',
	'Test.apply.uncheck.title': 'Désactiver le test {id}',
	'Test.apply.check.alt': 'Loupe',
	'Test.apply.uncheck.alt': 'Interdit',
	'Test.done': 'Test fait - Cliquer pour marquer le test comme "à faire"',
	'Test.todo': 'Test à faire - Cliquer pour marquer le test comme "fait"',
	'Test.instructions': 'Instructions',
	'TestHelpers.title': 'Description du test',
	'Options.references.label': 'Version du référentiel RGAA à utiliser :',
	'Options.references.submit': 'Valider',
	'Options.references.successMessage': 'Version mise à jour',
	'ColorInput.pickPixelButton.title':
		"Prélever la couleur d'un pixel dans la page",
	'ColorInput.pickTextButton.title':
		"Prélever la couleur du texte à partir d'une sélection dans la page",
	'ColorInput.invalidFormatError':
		'Cette couleur est invalide. Veuillez utiliser un code hexadécimal (#f00, #a2a2a2, ...) ou un nom de couleur HTML (red, yellow, ...)',
	'ColorInput.sample': 'Aperçu de la couleur',
	'ColorContrastResult.ratio': 'Ratio de contraste',
	'ColorContrastResult.invalidResult': 'invalide',
	'ExternalTool.linkTitle':
		"Ouvrir l'outil (s'ouvre dans une nouvelle fenêtre)",
	'HeadingsHierarchy.title': 'Hiérarchie de titres',
	'HeadingsHierarchy.noItems': 'Aucun titre trouvé dans la page.',
	'Helper.addClassName': `
		Ajoute une classe <code>{className}</code>
		aux éléments <code>{selector}</code>
	`,
	'Helper.colorContrast': "Affiche un outil d'analyse des contrastes",
	'Helper.disableAllStyles': 'Désactive tous les styles de la page',
	'Helper.externalTool': `
		{hasName, select,
			true {Ouvre l'outil externe "{name}"}
			other {Ouvre un outil externe}
		}
	`,
	'Helper.headingsHierarchy': 'Affiche la hiérarchie de titres de la page',
	'Helper.outline': `Entoure les éléments <code>{selector}</code> {showTag, select,
		true {et affiche leur type}
		other {}
	}`,
	'Helper.showAttributes': `
		{attributeCount, plural,
			one {Affiche l'attribut <code>{attributes}</code>}
			other {Affiche les attributs <code>{attributes}</code>}
		}
		des éléments <code>{selector}</code>
		{showMissing, select,
			true {
				{attributeCount, plural,
					one {(y compris si n'est pas défini)}
					other {(y compris si ils ne sont pas définis)}
				}
			}
			other {}
		}
	`,
	'Helper.showChildElements': `
		Dans les éléments <code>{selector}</code>,
		pour chaque élément enfant <code>{childrenSelector}</code> :
		<ul>
			{showName, select,
				true {
					<li>Affiche le type {showMissingAttributes, select,
						true {(y compris si l'élément est vide)}
						other {}
					}</li>
				}
				other {}
			}
			{attributeCount, select,
				0 {}
				1 {
					<li>Affiche l'attribut <code>{attributes}</code> {showMissingAttributes, select,
						true {(y compris si il n'est pas défini)}
						other {}
					}</li>
				}
				other {
					<li>Affiche les attributs <code>{attributes}</code> {showMissingAttributes, select,
						true {(y compris si ils ne sont pas définis)}
						other {}
					}</li>
				}
			}
			{showContent, select,
				true {
					<li>Affiche le contenu</li>
				}
				other {}
			}
		</ul>
	`,
	'Helper.showElement': `
		Pour chaque élément <code>{selector}</code> :
		<ul>
			{showName, select,
				true {
					<li>Affiche le type {showMissingAttributes, select,
						true {(y compris si l'élément est vide)}
						other {}
					}</li>
				}
				other {}
			}
			{attributeCount, select,
				0 {}
				1 {
					<li>Affiche l'attribut <code>{attributes}</code> {showMissingAttributes, select,
						true {(y compris si il n'est pas défini)}
						other {}
					}</li>
				}
				other {
					<li>Affiche les attributs <code>{attributes}</code> {showMissingAttributes, select,
						true {(y compris si ils ne sont pas définis)}
						other {}
					}</li>
				}
			}
			{showContent, select,
				true {
					<li>Affiche le contenu</li>
				}
				other {}
			}
		</ul>
	`,
	'Helper.style': `
		{hasDescription, select,
			true {{description}}
			other {Ajoute des styles dans la page}
		}
	`,
	'Helper.validateLocalPage':
		'Ouvre l\'outil externe "Validateur W3C pour HTML local"',
	'Helper.viewSource': 'Ouvre l\'outil "Voir les sources".',
	'ReferencePage.styles.toggle.label': 'CSS',
	'ReferencePage.styles.toggle.disabled.true':
		'Afficher les styles de la page',
	'ReferencePage.styles.toggle.disabled.false': 'Masquer les styles de la page'
};

export default messages;
