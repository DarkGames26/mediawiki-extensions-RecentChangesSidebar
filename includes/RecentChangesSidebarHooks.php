<?php

class RecentChangesSidebarHooks {
    public static function onBeforePageDisplay(OutputPage &$out, Skin &$skin) {
        if ($skin->getSkinName() !== 'vector') {
            return;
        }

        $out->addModules('ext.RecentChangesSidebar');

        // Sidebar HTML content
        $sidebarHTML = <<<HTML
        <div id="p-recent-changes" class="vector-menu mw-portlet mw-portlet-tb vector-menu-portal portal">
            <h3 class="vector-menu-heading">{$skin->msg('recentchanges-sidebar')->escaped()}</h3>
            <div class="vector-menu-content">
                <ul id="recent-changes-list">
                    <li>{$skin->msg('loading')->escaped()}</li>
                </ul>
            </div>
        </div>
        HTML;

        // Add sidebar HTML
        $out->addHTML($sidebarHTML);

        // Function to add inline script
        $script = <<<JS
            function moveSidebarToPanel() {
                var sidebar = document.getElementById('p-recent-changes');
                if (sidebar) {
                    var panel = document.getElementById('mw-panel');
                    if (panel) {
                        panel.appendChild(sidebar);
                    }
                }
            }
            moveSidebarToPanel();
        JS;

        // Add inline script
        $out->addInlineScript($script);

        // Remove the default recent changes link in #p-navigation
        $out->addInlineScript('
            document.addEventListener("DOMContentLoaded", function() {
                var recentChanges = document.getElementById("p-recentchanges");
                if (recentChanges) {
                    recentChanges.remove();
                }
            });
        ');
    }
}
?>
