import 'reflect-metadata';
import { TypedModel } from '../model';

export function property(target: TypedModel, propertyKey: string): void;
export function property(
	meta: any,
): (target: TypedModel, propertyKey: string) => void;
export function property(
	targetOrMeta: TypedModel | any,
	propertyKey?: string,
) {
	if (targetOrMeta instanceof TypedModel) {
		savePropertyMeta(targetOrMeta, propertyKey);
		return;
	}

	const meta = targetOrMeta;
	return (target: TypedModel, propKey: string) => {
		savePropertyMeta(target, propKey, meta);
	};
}

function savePropertyMeta(target: TypedModel, propertyKey: string, meta: any = {}) {
	const constructor = (target.constructor as any);
	if (!constructor._meta) {
		constructor._meta = {
			properties: {},
			schemaOptions: {}
		};
	}

	const propsMeta: object = constructor._meta.properties;

	if (!meta.type) {
		const type = Reflect.getMetadata('design:type', target, propertyKey);

		if (type) {
			meta.type = type;
		} else {
			const name = constructor.name;
			throw new Error(
				`Type of ${name}.${propertyKey} isn't set. Uf you use typescript ` +
				'you need to enable emitDecoratorMetadata in tsconfig.json',
			);
		}
	}

	propsMeta[propertyKey] = meta;
}
