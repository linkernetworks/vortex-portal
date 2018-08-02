## vortex portal version
LAST_VERSION := $(shell node -p "require('./package.json').version")

## git tag version ########################################

.PHONY: push.tag
push.tag:
	@echo "Current git tag version: "$(LAST_VERSION)
	git tag $(LAST_VERSION)
	git push --tags
