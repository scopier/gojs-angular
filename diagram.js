angular.module('cmdbApp')
    .directive('goDiagram', function() {
          return {
                restrict: 'E',
                template: '<div></div>',
                replace: true,
                scope: { model: '=goModel' },
                link: function(scope, element, attrs) {
                    var draw = go.GraphObject.make;
                    var diagram = draw(
                        go.Diagram,
                        element[0],
                        {
                            initialContentAlignment: go.Spot.Center,
                            maxSelectionCount: 1,
                            allowDelete: false
                        });
                    diagram.animationManager.isEnabled = false;
                    diagram.scrollMode = go.Diagram.InfiniteScroll;
                    diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
                    diagram.allowDrop = false;
                    diagram.initialAutoScale = go.Diagram.Uniform;
                    diagram.toolManager.draggingTool.doCancel();
                    diagram.toolManager.draggingTool.doDeactivate();
                    diagram.toolManager.dragSelectingTool.isEnabled = false;
                    diagram.initialContentAlignment = go.Spot.Center;
                    diagram.padding = new go.Margin(10, 10, 10, 10);
                    diagram.layout = draw(
                        go.LayeredDigraphLayout,
                        {
                            isOngoing: false,
                            layerSpacing: 100,
                            columnSpacing: 30,
                            setsPortSpots: false

                        }
                    );
                    var overview = draw(
                        go.Overview,
                        "overview",
                        {
                            observed: diagram
                        }
                    );
                    overview.box.elt(0).figure = "RoundedRectangle";
                    overview.box.elt(0).stroke = "#53069B";
                    overview.box.elt(0).strokeWidth = 4;
                    scope.$watch("model", function(n) {
                        var o = diagram.model;
                        if (o !== n) {
                          diagram.model = n;
                        }
                      });

                    diagram.nodeTemplate = draw(
                        go.Node,
                        new go.Binding("category", "serviceType"),
                        go.Panel.Auto,
                        {
                            selectionAdorned: false,
                            cursor: "pointer",
                            name: "NODE",
                        },
                        draw(
                            go.Shape,
                            {
                                alignment: go.Spot.TopLeft,
                                alignmentFocus: go.Spot.TopLeft,
                                figure: "RoundedRectangle",
                                stroke: "#C5C5C5",
                                fill: "#ffffff",
                                strokeWidth: 1,
                                margin: 0,
                                isPanelMain: true,
                                minSize: new go.Size(120, NaN),
                                name: "NODE_SHAPE",
                                portId: ""

                            }
                        ),
                        draw(
                            go.Panel,
                            go.Panel.Spot,
                            {
                                name: "NODE_PANEL",
                                alignment: go.Spot.TopLeft,
                                alignmentFocus: go.Spot.TopLeft
                               },
                            draw(
                                go.Panel,
                                go.Panel.Vertical,
                                {
                                    alignment: go.Spot.TopLeft,
                                    alignmentFocus: go.Spot.TopLeft,
                                    minSize: new go.Size(120, NaN)
                                },
                                draw(
                                    go.Picture,
                                    {
                                        margin: new go.Margin(18, 0, 5, 0),
                                        desiredSize: new go.Size(80, 40),
                                        imageStretch: go.GraphObject.Uniform
                                    },
                                    new go.Binding("source", "serviceType", function(serviceType){
                                        return '/static/images/servermap/' + serviceType + '.png'
                                    })
                                ),
                                draw(
                                    go.TextBlock,
                                    new go.Binding("text", "applicationName").makeTwoWay(),
                                    {
                                        alignment: go.Spot.BottomCenter,
                                        alignmentFocus: go.Spot.BottomCenter,
                                        name: "NODE_TEXT",
                                        margin: 6,
                                        stroke: "#000000",
                                        font: "11pt avn85,bold,ng,dotum,AppleGothic,sans-serif",
                                        editable: false
                                    }
                                )
                            )
                        )
                    );
                    diagram.linkTemplate = draw(
                        go.Link,
                        {
                            layerName: "Foreground",
                            reshapable: false,
                            corner: 10,
                            cursor: "pointer",
                            routing: go.Link.Normal,
                        },
                        draw(
                            go.Shape,
                            {
                                name: "Link",
                                isPanelMain: true,
                                stroke: "#c5c5c5",
                                strokeWidth: 1.5
                            }
                        ),
                        draw(
                            go.Shape,
                            {
                                name: "ARROW",
                                toArrow: "standard",  // toArrow : kite, standard, OpenTriangle
                                fill: "#C5C5C5",
                                stroke: null,
                                scale: 1.5
                            }
                        ),
                        draw(
                            go.Panel,
                            go.Panel.Auto,
                            draw(
                                go.Shape,
                                "RoundedRectangle",
                                {
                                    name: "LINK2",
                                    fill: "#ffffff",
                                    stroke: "#ffffff",
                                    portId: "",
                                    fromLinkable: true,
                                    toLinkable: true
                                }
                            ),
                            draw(
                                go.Panel,
                                go.Panel.Horizontal,
                                {
                                    margin: 4
                                },
                                draw(
                                    go.TextBlock,
                                    {
                                        name: "LINK_TEXT",
                                        textAlign: "center",
                                        font: "11pt avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                                        margin: 1
                                    },
                                    new go.Binding("text", "totalCount", function (val) {
                                        return val;
                                    }) ,
                                    new go.Binding("stroke", "hasAlert", function (hasAlert) {
                                        return (hasAlert) ? "#FF1300" : "#000000";
                                    })

                                )
                            )
                        )
                    )
                }
          }
    });