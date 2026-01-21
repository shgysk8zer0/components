export function createDeprecatedPolicy(name) {
	try {
		trustedTypes.createPolicy(name, { createHTML: () => '' });
		console.warn(new DOMException(`Deperacted policy "${name}" is no longer used and should be removed.`));
		return false;
	} catch {
		return true;
	}
}
