function noop() {}
module.exports = [
  [
    [
      [
        "a",
        [
          "b",
          [
            "k",
            [
              "a",
              ["b", ["c"]],
              ["a", ["x", ["c"], ["a", ["x", ["k"]]], ["d", ["z"]]]],
              ["d", ["m"]]
            ],
            ["d", ["e"]]
          ]
        ]
      ],
      ["d", ["e"]],
      "d",
      ["e", "z"],
      "j"
    ],
    [
      "b",
      [
        "k",
        [
          "a",
          ["b", ["c"]],
          ["a", ["x", ["c"],
            ["a", ["x", ["k"]]],
            ["d", ["z"]]
          ]],
          ["d", ["m"]]
        ],
        ["d", ["e"]]
      ]
    ],
    ["d", ["e"]],
    noop,
    "j"
  ]
]
