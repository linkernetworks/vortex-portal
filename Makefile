## vortex portal version
PORTAL_VERSION := $(shell node -p "require('./package.json').version")

## git tag version ########################################

.PHONY: push.tag
push.tag:
	@echo "Current git tag version: "$(PORTAL_VERSION)
	git tag $(PORTAL_VERSION)
	git push --tags
