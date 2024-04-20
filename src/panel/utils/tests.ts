import {TestStatus} from '../../common/types';

export const aggregateStatuses = (statuses: TestStatus[]): TestStatus =>
	statuses.includes('NC')
		? 'NC'
		: statuses.includes('NT')
			? 'NT'
			: statuses.includes('C')
				? 'C'
				: 'NA';
