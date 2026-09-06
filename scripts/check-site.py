#!/usr/bin/env python3
"""Check built HTML links, anchors, and the home project index. No dependencies."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.duplicate_ids = set()
        self.project = False
        self.cards = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        identifier = attrs.get("id")
        if identifier:
            if identifier in self.ids:
                self.duplicate_ids.add(identifier)
            self.ids.add(identifier)
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])
        if "project-page" in attrs.get("class", "").split():
            self.project = True
        if "data-project-tags" in attrs:
            self.cards += 1


def check(root):
    pages = {}
    destinations = {}
    errors = []
    for path in root.rglob("*.html"):
        page = Page()
        page.feed(path.read_text())
        pages[path] = page
        for identifier in page.duplicate_ids:
            errors.append(f"{path.relative_to(root)}: duplicate id {identifier}")

    for path, page in pages.items():
        destinations[path] = set()
        for link in page.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            if url.path.startswith("/"):
                target = root / unquote(url.path).lstrip("/")
            else:
                target = path.parent / unquote(url.path) if url.path else path
            target = target.resolve()
            if target.is_dir():
                target /= "index.html"
            if target in pages:
                destinations[path].add(target)
            if not target.exists():
                errors.append(f"{path.relative_to(root)}: missing {link}")
            elif url.fragment and "=" not in url.fragment and target in pages:
                if unquote(url.fragment) not in pages[target].ids:
                    errors.append(f"{path.relative_to(root)}: missing anchor {link}")

    home = pages.get(root / "index.html")
    projects = [path for path, page in pages.items() if page.project]
    if home is None:
        errors.append("Missing home page")
    else:
        direct_projects = destinations[root / "index.html"].intersection(projects)
        if home.cards != len(direct_projects):
            errors.append(f"Home has {home.cards} cards for {len(direct_projects)} project links")
        reachable = set()
        pending = [root / "index.html"]
        while pending:
            path = pending.pop()
            if path not in reachable:
                reachable.add(path)
                pending.extend(destinations.get(path, set()) - reachable)
        for path in projects:
            if path not in reachable:
                errors.append(f"Project unreachable from home: {path.relative_to(root)}")
    return pages, projects, errors


if __name__ == "__main__":
    root = (Path(__file__).resolve().parents[1] / "_site").resolve()
    if not root.exists():
        raise SystemExit("Run bundle exec jekyll build first.")
    pages, projects, errors = check(root)
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"OK: {len(pages)} pages, {len(projects)} projects; local links and anchors valid.")
