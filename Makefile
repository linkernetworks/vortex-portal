## vortex portal version
PORTAL_VERSION = 0.1.0

## git tag version ########################################

.PHONY: push.tag
push.tag:
	@echo "Current git tag version:"$(PORTAL_VERSION)
	git tag $(PORTAL_VERSION)
	git push --tags
